// Boss loot per participant (docs/plans/loot-difficulty.md, D2a, user decision 14.11). With two or more participants
// (eras/bosses.js) nothing lands on the ground: the killer gets the original drop, every other participant rolls the
// boss loot table as the killer, so era gating (AStages loot restrictions) applies per player. Bosses whose loot comes
// from code instead of a table give each participant a copy, era-checked here. Bosses that place a loot container are
// skipped: Lootr turns it into a per-player container within seconds (tested 14.11), and Twilight Forest additionally
// scales item counts per player (IBossLootBuffer, extra_count_per_player).
(() => {
  const TagKey = Java.loadClass('net.minecraft.tags.TagKey')
  const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const LootParamsBuilder = Java.loadClass('net.minecraft.world.level.storage.loot.LootParams$Builder')
  const LootContextParams = Java.loadClass('net.minecraft.world.level.storage.loot.parameters.LootContextParams')
  const LootContextParamSets = Java.loadClass('net.minecraft.world.level.storage.loot.parameters.LootContextParamSets')

  const BOSSES = TagKey.create(Registries.ENTITY_TYPE, ResourceLocation.parse('gg:scaled_bosses'))
  // Mod namespaces or entity ids.
  const OWN_LOOT_CONTAINER = ['twilightforest', 'bosses_of_mass_destruction:gauntlet', 'bosses_of_mass_destruction:obsidilith']
  // From the plan's D3 analysis: no loot table, or an empty one, so the drop comes from code. A random empty roll of a
  // real table must not fall back to copying, hence the explicit list.
  const CODE_DROPS = [
    'ars_nouveau:wilden_boss',
    'the_bumblezone:cosmic_crystal_entity',
    'eternal_starlight:the_gatekeeper',
    'eternal_starlight:starlight_golem',
    'eternal_starlight:lunar_monstrosity',
  ]
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
  const isBoss = id => (bossIds || loadBossIds())[id] === true

  const rollTable = (boss, source, player) => {
    const table = boss.server.reloadableRegistries().getLootTable(boss.getLootTable())
    const params = new LootParamsBuilder(boss.level)
      .withParameter(LootContextParams.THIS_ENTITY, boss)
      .withParameter(LootContextParams.ORIGIN, boss.position())
      .withParameter(LootContextParams.DAMAGE_SOURCE, source)
      .withParameter(LootContextParams.ATTACKING_ENTITY, player)
      .withParameter(LootContextParams.LAST_DAMAGE_PLAYER, player)
      .withLuck(player.getLuck())
      .create(LootContextParamSets.ENTITY)
    const out = []
    table.getRandomItems(params).forEach(stack => out.push(stack))
    return out
  }

  const eraChecked = (player, stack) => {
    const era = global.ggEras.itemEra(String(stack.id))
    if (era <= global.ggEras.eraOf(player)) return stack
    return typeof ggLootSeal === 'function' ? ggLootSeal(stack, global.ggErasData.ERAS[era]) : null
  }

  const give = (player, stacks) => stacks.forEach(stack => {
    if (stack != null && !stack.isEmpty()) global.ggEras.giveSafely(player, stack)
  })

  const shareFor = (id, boss, source, player, original) => CODE_DROPS.indexOf(id) >= 0
    ? original.map(stack => eraChecked(player, stack.copy()))
    : rollTable(boss, source, player)

  EntityEvents.drops(event => {
    const boss = event.entity
    const id = String(boss.type)
    if (!isBoss(id) || OWN_LOOT_CONTAINER.indexOf(id) >= 0 || OWN_LOOT_CONTAINER.indexOf(id.split(':')[0]) >= 0) return
    const participants = global.ggEras.bossParticipants(boss)
    if (participants.length < 2) return
    const killer = event.source.actual
    const killerId = killer && killer.isPlayer() ? String(killer.uuid) : null
    if (!participants.some(p => String(p.uuid) === killerId)) return
    const original = []
    event.drops.forEach(itemEntity => original.push(itemEntity.item.copy()))
    const source = event.getSource()
    participants.forEach(p => {
      if (String(p.uuid) === killerId) give(p, original)
      else give(p, shareFor(id, boss, source, p, original))
    })
    // Last: in KubeJS 2101 cancel() also exits the handler.
    event.cancel()
  })
})()
