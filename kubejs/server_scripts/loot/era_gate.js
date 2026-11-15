// priority: 10
// Era-gated loot (docs/plans/loot-difficulty.md, section A). AStages loot restrictions, one per era stage, built from the
// item map of startup_scripts/eras. A future-era item is replaced by gg:zapieczetowany_lup holding the original stack,
// which the player can open once the team reaches that era. AStages compares against player stages, which the era sync
// copies from the FTB team, so chests (Lootr passes the opener), mob kills, fishing, archaeology and block drops are covered.

// Top level on purpose: loot/boss_loot.js seals code-dropped boss loot with the same function.
function ggLootSeal(stack, era) {
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
  const CustomData = Java.loadClass('net.minecraft.world.item.component.CustomData')
  const ItemLore = Java.loadClass('net.minecraft.world.item.component.ItemLore')
  const ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
  const CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
  // The replacer gets only the stack, and KubeJS 2101 has no Utils.server.
  const ServerLifecycleHooks = Java.loadClass('net.neoforged.neoforge.server.ServerLifecycleHooks')
  const tag = new CompoundTag()
  tag.put('item', stack.save(ServerLifecycleHooks.getCurrentServer().registryAccess()))
  tag.putInt('era', era.n)
  const root = new CompoundTag()
  root.put('gg_sealed', tag)
  const out = new ItemStack(BuiltInRegistries.ITEM.get(ResourceLocation.parse('gg:zapieczetowany_lup')))
  out.set(DataComponents.CUSTOM_DATA, CustomData.of(root))
  out.set(DataComponents.LORE, new ItemLore([
    Text.of(`Otworzysz w: ${era.name}`).gold().italic(false),
    Text.of('Zawiera: ').gray().italic(false).append(stack.getHoverName()),
  ]))
  return out
}

(() => {
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
  const ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

  const SEAL = 'gg:zapieczetowany_lup'
  const data = global.ggErasData

  if (!BuiltInRegistries.ITEM.containsKey(ResourceLocation.parse(SEAL))) {
    console.warn(`[loot] ${SEAL} is not registered, era-gated loot is OFF (future-era loot passes unchanged)`)
    return
  }

  const items = global.ggErasItems || {}
  const byEra = {}
  Object.keys(items).forEach(id => {
    const n = items[id]
    if (!byEra[n]) byEra[n] = []
    byEra[n].push(id)
  })
  Object.keys(byEra).forEach(n => {
    const era = data.ERAS[n]
    if (!era || !era.stage) return
    AStages.addRestrictionForLoot(`gg_loot_${era.id}`, era.stage)
      .restrictItems(byEra[n])
      .replacer(stack => ggLootSeal(stack, era))
      .applyEverywhere()
  })

  const sealedData = stack => {
    const custom = stack.get(DataComponents.CUSTOM_DATA)
    if (custom == null) return null
    const root = custom.copyTag()
    return root.contains('gg_sealed') ? root.getCompound('gg_sealed') : null
  }

  const open = (player, stack, tag) => {
    const era = tag.getInt('era')
    if (global.ggEras.eraOf(player) < era) {
      player.setStatusMessage(Text.of(`Otworzysz w: ${data.ERAS[era].name}`).red())
      return
    }
    const original = ItemStack.parseOptional(player.level.registryAccess(), tag.getCompound('item'))
    stack.shrink(1)
    if (!original.isEmpty()) global.ggEras.giveSafely(player, original)
  }

  ItemEvents.rightClicked(SEAL, event => {
    const tag = sealedData(event.item)
    if (tag == null) return
    open(event.player, event.item, tag)
    event.cancel()
  })
})()
