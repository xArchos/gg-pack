// priority: 50
// Team eras (docs/plans/eras.md 6.1): FTB Teams team stages are the source of truth, AStages player stages mirror them
// because AStages only checks player and server stages. The API lives in startup scripts because KubeJS forbids writing
// to `global` from server scripts; server_scripts/eras/sync.js only wires the events.
// Rhino rejects const/let declared inside nested blocks (try, if, loop bodies) on repeated calls, so those bodies are helpers.
(() => {
  const CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
  const ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
  const FTBTeamsAPI = Java.loadClass('dev.ftb.mods.ftbteams.api.FTBTeamsAPI')
  const TeamStagesHelper = Java.loadClass('dev.ftb.mods.ftbteams.api.TeamStagesHelper')
  const ServerQuestFile = Java.loadClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile')
  const AStagesUtils = Java.loadClass('com.alessandro.astages.infrastructure.integration.kubejs.util.KubeJSServerUtils')
  const UUID = Java.loadClass('java.util.UUID')

  const DATA = global.ggErasData
  const ERAS = DATA.ERAS
  const MAX = ERAS.length - 1
  // Texts for players come from the lang files (keys from the translations topic). A dedicated server has no lang files,
  // so messages that also reach the server console or log (broadcasts, command feedback) carry a Polish fallback.
  // Numbers go in as strings: Rhino passes a JS number as a Double, which %s prints as "3.0".
  const eraText = era => Text.translatableWithFallback(`gg.era.${era.id}`, era.name)
  let listeners = []
  let syncErrorLogged = false

  const manager = () => FTBTeamsAPI.api().getManager()
  const teamOf = player => manager().getTeamForPlayer(player).orElse(null)
  const teamById = id => manager().getTeamByID(UUID.fromString(String(id))).orElse(null)

  const eraFromStages = stages => {
    let era = 0
    stages.forEach(s => {
      ERAS.forEach(e => {
        if (e.stage === String(s) && e.n > era) era = e.n
      })
    })
    return era
  }
  const teamEra = team => team ? eraFromStages(TeamStagesHelper.getStages(team)) : 0

  const notifyOne = (fn, team, from, to) => {
    try { fn(team, from, to) } catch (e) { console.error(`[eras] onEraChanged listener failed: ${e}`) }
  }
  const notify = (team, from, to) => listeners.forEach(fn => notifyOne(fn, team, from, to))

  // Writes the team's stages without announcing; used for admin changes and the leave-party choice.
  const writeTeamEra = (team, era, reason) => {
    const from = teamEra(team)
    ERAS.forEach(e => {
      if (!e.stage) return
      if (e.n <= era) TeamStagesHelper.addTeamStage(team, e.stage)
      else if (TeamStagesHelper.hasTeamStage(team, e.stage)) TeamStagesHelper.removeTeamStage(team, e.stage)
    })
    team.getExtraData().putInt('gg_era', era)
    team.markDirty()
    if (from === era) return
    console.info(`[eras] ${team.getName().getString()}: ${from} -> ${era} (${reason})`)
    notify(team, from, era)
  }

  const announce = (team, era) => {
    const data = team.getExtraData()
    const known = data.contains('gg_era') ? data.getInt('gg_era') : 0
    if (era === known) return
    data.putInt('gg_era', era)
    team.markDirty()
    console.info(`[eras] ${team.getName().getString()}: ${known} -> ${era} (team stages)`)
    if (era > known) {
      manager().getServer().tell(Text.translatableWithFallback('gg.era.announce', '%s wchodzi w: %s',
        team.getName().getString(), eraText(ERAS[era])).gold())
    }
    notify(team, known, era)
  }

  const isFuture = (stack, era) => !stack.isEmpty() && lookup(global.ggErasItems || {}, stack.id, -1) > era

  // What does not fit is thrown in front of the player: only that player can pick it up, and it lasts 15 minutes instead
  // of 5 (user decision 14.11). The entity tag PROTECTED_DROP tells item clean-ups to leave it to its own despawn.
  // Inventory.add is avoided: in creative mode it deletes what does not fit.
  const PROTECTED_DROP = 'gg_protected'
  const PROTECTED_LIFESPAN_TICKS = 15 * 60 * 20
  const giveSafely = (player, stack) => {
    const slot = player.inventory.getFreeSlot()
    if (slot >= 0) {
      player.inventory.setItem(slot, stack)
      return 0
    }
    const dropped = player.drop(stack, false)
    if (dropped == null) return 0
    dropped.setTarget(player.uuid)
    dropped.lifespan = PROTECTED_LIFESPAN_TICKS
    dropped.addTag(PROTECTED_DROP)
    return 1
  }

  const takeFromList = (player, list, i, era) => {
    const stack = list.get(i)
    if (!isFuture(stack, era)) return 0
    list.set(i, ItemStack.EMPTY)
    player.persistentData.putInt('gg_dropped', player.persistentData.getInt('gg_dropped') + giveSafely(player, stack))
    return 1
  }
  const takeAllFromList = (player, list, era) => {
    let moved = 0
    for (let i = 0; i < list.size(); i++) moved += takeFromList(player, list, i, era)
    return moved
  }
  const takeFromHandler = (player, handler, i, era) => {
    const stack = handler.getStackInSlot(i)
    if (!isFuture(stack, era)) return 0
    handler.setStackInSlot(i, ItemStack.EMPTY)
    player.persistentData.putInt('gg_dropped', player.persistentData.getInt('gg_dropped') + giveSafely(player, stack))
    return 1
  }
  const takeAllFromHandler = (player, handler, era) => {
    let moved = 0
    for (let i = 0; i < handler.getSlots(); i++) moved += takeFromHandler(player, handler, i, era)
    return moved
  }

  // AStages drops worn items of a locked era on the ground; moving them into the inventory first keeps them safe
  // (an inventory full of them still spills at the player's feet, as any /give would).
  const unequipFuture = (player, era) => {
    const inv = player.inventory
    player.persistentData.putInt('gg_dropped', 0)
    let moved = takeAllFromList(player, inv.armor, era) + takeAllFromList(player, inv.offhand, era)
    CuriosApi.getCuriosInventory(player).ifPresent(curios => {
      moved += takeAllFromHandler(player, curios.getEquippedCurios(), era)
    })
    const dropped = player.persistentData.getInt('gg_dropped')
    player.persistentData.remove('gg_dropped')
    if (moved > 0) player.tell(Text.translatable('gg.era.moved', String(moved)).gold())
    if (dropped > 0) player.tell(Text.translatable('gg.era.dropped', String(dropped)).red())
  }

  const countFuture = (player, era) => {
    const inv = player.inventory
    let count = 0
    for (let i = 0; i < inv.getContainerSize(); i++) if (isFuture(inv.getItem(i), era)) count++
    CuriosApi.getCuriosInventory(player).ifPresent(curios => {
      count += countInHandler(curios.getEquippedCurios(), era)
    })
    return count
  }
  const countInHandler = (handler, era) => {
    let count = 0
    for (let i = 0; i < handler.getSlots(); i++) if (isFuture(handler.getStackInSlot(i), era)) count++
    return count
  }

  const remind = player => {
    const pd = player.persistentData
    if (!pd.contains('gg_leave_party')) return
    const partyEra = ERAS[pd.getInt('gg_leave_party_era')]
    const ownEra = ERAS[pd.getInt('gg_leave_own_era')]
    const lost = countFuture(player, ownEra.n)
    const ownHover = lost > 0
      ? Text.translatable('gg.era.choice.own.hover_lost', String(lost))
      : Text.translatable('gg.era.choice.own.hover')
    player.tell(Text.translatable('gg.era.left_team').gold())
    player.tell(Text.translatable('gg.era.choice.party', eraText(partyEra)).green()
      .clickRunCommand('/ery wybor druzyna')
      .hover(Text.translatable('gg.era.choice.party.hover'))
      .append(Text.of('  '))
      .append(Text.translatable('gg.era.choice.own', eraText(ownEra)).aqua()
        .clickRunCommand('/ery wybor wlasny')
        .hover(ownHover)))
    if (lost > 0) player.tell(Text.translatable('gg.era.choice.lost', String(lost)).red())
  }

  const initParty = (player, team, previousEra) => {
    const tdata = team.getExtraData()
    if (tdata.getBoolean('gg_init')) return
    tdata.putBoolean('gg_init', true)
    team.markDirty()
    // FTB Quests seeds a new party with its creator's quest progress; the era follows the same rule.
    if (String(team.getOwner()) === String(player.uuid) && previousEra > teamEra(team)) writeTeamEra(team, previousEra, 'party founder')
  }

  const leftParty = (player, team, previous, previousEra) => {
    const own = teamEra(team)
    if (previousEra === own) return
    const pd = player.persistentData
    pd.putString('gg_leave_party', previous)
    pd.putInt('gg_leave_party_era', previousEra)
    pd.putInt('gg_leave_own_era', own)
    // Provisionally keep the higher era so nobody is pushed out of a dimension before reading the choice.
    writeTeamEra(team, Math.max(previousEra, own), 'left party, provisional')
    remind(player)
  }

  // A disbanded party no longer exists; personal teams are never "left".
  const wasParty = id => {
    const team = teamById(id)
    return team == null || team.isPartyTeam()
  }

  // Detects party changes between syncs (docs/plans/eras.md 6.1, decision D3).
  const trackTeamChange = (player, team) => {
    const pd = player.persistentData
    const current = String(team.getId())
    const previous = pd.getString('gg_team')
    const previousEra = pd.getInt('gg_team_era')
    if (previous && previous !== current) {
      // A pending leave-party choice only makes sense for the personal team; joining another party drops it.
      if (team.isPartyTeam()) clearChoice(pd)
      if (team.isPartyTeam()) initParty(player, team, previousEra)
      else if (wasParty(previous)) leftParty(player, team, previous, previousEra)
    }
    pd.putString('gg_team', current)
    pd.putInt('gg_team_era', teamEra(team))
  }

  const mirrorStages = (player, era) => {
    const have = AStagesUtils.getStagesFromPlayer(player)
    ERAS.forEach(e => {
      if (!e.stage) return
      const has = have.contains(e.stage)
      if (e.n <= era && !has) AStagesUtils.addStageToPlayer(player, e.stage, false, false, false)
      else if (e.n > era && has) AStagesUtils.removeStageFromPlayer(player, e.stage, false, false, false)
    })
  }

  const syncNow = player => {
    const team = teamOf(player)
    if (!team) return
    trackTeamChange(player, team)
    const era = teamEra(team)
    if (eraFromStages(AStagesUtils.getStagesFromPlayer(player)) > era) unequipFuture(player, era)
    mirrorStages(player, era)
    announce(team, era)
  }

  const syncPlayer = player => {
    try { syncNow(player) } catch (e) {
      if (!syncErrorLogged) console.error(`[eras] sync failed for ${player.username}: ${e}`)
      syncErrorLogged = true
    }
  }

  const copyQuests = (team, party) => {
    const quests = ServerQuestFile.INSTANCE
    if (party && quests) quests.getOrCreateTeamData(team).copyData(quests.getOrCreateTeamData(party))
  }

  const choose = (player, keepParty) => {
    const pd = player.persistentData
    if (!pd.contains('gg_leave_party')) return false
    const team = teamOf(player)
    if (team == null || team.isPartyTeam()) {
      clearChoice(pd)
      return false
    }
    if (keepParty) {
      writeTeamEra(team, pd.getInt('gg_leave_party_era'), 'choice: keep party progress')
      copyQuests(team, teamById(pd.getString('gg_leave_party')))
    } else {
      writeTeamEra(team, pd.getInt('gg_leave_own_era'), 'choice: own progress')
    }
    clearChoice(pd)
    syncPlayer(player)
    return true
  }

  const clearChoice = pd => {
    pd.remove('gg_leave_party')
    pd.remove('gg_leave_party_era')
    pd.remove('gg_leave_own_era')
  }

  const lookup = (table, id, fallback) => {
    const value = table[String(id)]
    return value === undefined ? fallback : value
  }

  global.ggEras = {
    ERAS: ERAS,
    eraText: eraText,
    eraOf: player => teamEra(teamOf(player)),
    teamEra: team => teamEra(typeof team === 'string' ? teamById(team) : team),
    itemEra: id => lookup(global.ggErasItems || {}, id, -1),
    dimensionEra: id => lookup(DATA.DIMENSION_ERAS, id, 0),
    // Phases and parts of a boss count as that boss (eras.md 6.2a).
    mainBoss: id => DATA.BOSS_PHASES[String(id)] || DATA.BOSS_PARTS[String(id)] || String(id),
    // Bosses outside the table (Bumblezone crystal, elder guardian) have no fixed era: -1.
    bossEra: id => lookup(DATA.BOSS_ERAS, global.ggEras.mainBoss(id), -1),
    eraById: id => {
      let found = null
      ERAS.forEach(e => { if (e.id === String(id)) found = e })
      return found
    },
    onEraChanged: fn => listeners.push(fn),
    // Server scripts re-register their listeners on every /reload; sync.js clears the list first.
    resetListeners: () => { listeners = [] },
    setTeamEra: (team, era) => {
      writeTeamEra(team, era, 'admin')
      team.getOnlineMembers().forEach(p => syncPlayer(p))
    },
    teamOf: teamOf,
    // Free slot, otherwise thrown in front of the player: owner-only pickup, 15-minute lifespan, entity tag 'gg_protected'.
    giveSafely: giveSafely,
    PROTECTED_DROP: PROTECTED_DROP,
    syncPlayer: syncPlayer,
    remind: remind,
    choose: choose,
    // Set by server_scripts/eras/bosses.js.
    bossParticipants: entity => [],
  }
})()
