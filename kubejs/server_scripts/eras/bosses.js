// A boss kill credits every team that fought it, not only the team of the last hit (docs/plans/eras.md 6.2a, decision B1).
(() => {
  const TagKey = Java.loadClass('net.minecraft.tags.TagKey')
  const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
  const CustomData = Java.loadClass('net.minecraft.world.item.component.CustomData')
  const CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
  const TeamStagesHelper = Java.loadClass('dev.ftb.mods.ftbteams.api.TeamStagesHelper')

  // Shared with loot/difficulty scaling (E5): c:bosses plus mobs that show a boss bar without being tagged.
  const BOSSES = TagKey.create(Registries.ENTITY_TYPE, ResourceLocation.parse('gg:scaled_bosses'))
  const WINDOW_MS = 5 * 60 * 1000
  const RADIUS = 48
  // Other scripts read participants in their own death handlers, so the fight log outlives the death by a moment.
  const CLEANUP_TICKS = 20
  // Knight phantoms come in a group; only the last one counts as the kill.
  const GROUP_BOSSES = ['twilightforest:knight_phantom']

  ServerEvents.tags('entity_type', event => {
    event.add('gg:scaled_bosses', [
      '#c:bosses',
      'aquamirae:captain_cornelia',
      'born_in_chaos_v1:lord_pumpkinhead', 'born_in_chaos_v1:lord_pumpkinhead_withouta_horse', 'born_in_chaos_v1:lord_pumpkinhead_head',
      'deeperdarker:stalker',
      'discerning_the_eldritch:ascended_one',
      'illagerinvasion:invoker',
      'minecraft:warden',
      'minecraft:elder_guardian',
    ])
  })

  const hitsOnBoss = {}
  const hitsByBoss = {}
  // Entity uuid -> entity type, so a boss's death also counts the hits on its earlier phases and on its parts.
  const typeOfKey = {}

  // KubeJS hides several vanilla entity methods (getType, getUUID, level, getServer) behind properties of the same meaning.
  const typeId = entity => String(entity.type)
  const entityType = id => BuiltInRegistries.ENTITY_TYPE.get(ResourceLocation.parse(id))
  const mainBoss = id => global.ggEras.mainBoss(id)
  // EntityType.is() is overloaded and Rhino picks the wrong one, so the tag is read once into a set of ids.
  let bossIds = null
  const loadBossIds = () => {
    const ids = {}
    let count = 0
    BuiltInRegistries.ENTITY_TYPE.getTag(BOSSES).ifPresent(set => set.forEach(holder => {
      ids[String(holder.unwrapKey().get().location())] = true
      count++
    }))
    if (count > 0) bossIds = ids
    return ids
  }
  const isBoss = entity => (bossIds || loadBossIds())[typeId(entity)] === true
  const remember = (table, outer, inner) => {
    const row = table[outer] || (table[outer] = {})
    row[inner] = Date.now()
  }

  const distance = (a, b) => Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z))

  const record = (table, boss, player) => {
    const key = String(boss.uuid)
    typeOfKey[key] = typeId(boss)
    remember(table, key, String(player.uuid))
  }

  // Another entity of the same type is a separate fight (two withers), another phase or part of the same boss is not.
  const fightKeys = boss => {
    const own = String(boss.uuid)
    const id = typeId(boss)
    const main = mainBoss(id)
    const keys = [own]
    Object.keys(typeOfKey).forEach(k => {
      if (k !== own && typeOfKey[k] !== id && mainBoss(typeOfKey[k]) === main) keys.push(k)
    })
    return keys
  }

  const recent = (row, uuid, now) => row !== undefined && row[uuid] !== undefined && now - row[uuid] <= WINDOW_MS

  const participantsOf = boss => {
    const keys = fightKeys(boss)
    const now = Date.now()
    const out = []
    boss.server.players.forEach(p => {
      const uuid = String(p.uuid)
      const dealt = keys.some(k => recent(hitsOnBoss[k], uuid, now))
      const tanked = keys.some(k => recent(hitsByBoss[k], uuid, now))
        && String(p.level.dimension) === String(boss.level.dimension) && distance(p, boss) <= RADIUS
      if (dealt || tanked) out.push(p)
    })
    return out
  }

  const trophyFor = id => {
    const stack = Item.of('gg:trofeum')
    const tag = new CompoundTag()
    tag.putString('boss', id)
    stack.set(DataComponents.CUSTOM_DATA, CustomData.of(tag))
    stack.set(DataComponents.ITEM_NAME, Text.translatable('gg.boss.trophy_name', entityType(id).getDescription()))
    return stack
  }

  const groupStillAlive = boss => !boss.level.getEntitiesOfClass(boss.getClass(), boss.boundingBox.inflate(64),
    e => e.isAlive() && !e.uuid.equals(boss.uuid)).isEmpty()

  global.ggEras.bossParticipants = participantsOf

  EntityEvents.afterHurt(event => {
    const victim = event.entity
    const attacker = event.source.actual
    if (!attacker) return
    if (attacker.isPlayer() && isBoss(victim)) record(hitsOnBoss, victim, attacker)
    else if (victim.isPlayer() && isBoss(attacker)) record(hitsByBoss, attacker, victim)
  })

  EntityEvents.death(event => {
    const boss = event.entity
    if (!isBoss(boss)) return
    const id = typeId(boss)
    const main = mainBoss(id)
    const isPart = global.ggErasData.BOSS_PARTS[id] !== undefined
    const server = boss.server
    const keys = isPart ? [String(boss.uuid)] : fightKeys(boss)
    server.scheduleInTicks(CLEANUP_TICKS, () => keys.forEach(k => {
      delete hitsOnBoss[k]
      delete hitsByBoss[k]
      delete typeOfKey[k]
    }))

    if (isPart) return
    if (GROUP_BOSSES.indexOf(id) >= 0 && groupStillAlive(boss)) return

    const participants = participantsOf(boss)
    const killer = event.source.actual
    if (participants.length === 0 && killer && killer.isPlayer()) participants.push(killer)
    if (participants.length === 0) return

    const stage = `boss_${main.replace(':', '_')}`
    const teams = {}
    participants.forEach(p => {
      const team = global.ggEras.teamOf(p)
      if (team) teams[String(team.getId())] = team
      p.give(trophyFor(main))
    })
    const names = []
    Object.keys(teams).forEach(k => {
      TeamStagesHelper.addTeamStage(teams[k], stage)
      names.push(teams[k].getName().getString())
    })
    const name = id === main ? boss.displayName : entityType(main).getDescription()
    // Polish fallback for the server log (no lang files on a dedicated server).
    server.tell(Text.translatableWithFallback('gg.boss.defeated', 'Pokonano: %s. Zaliczenie dla: %s', name, names.join(', ')).gold())
  })
})()
