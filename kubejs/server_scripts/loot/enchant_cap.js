// Enchantment level cap in loot by the looter's era (docs/plans/loot-difficulty.md, section A, user decision 14.11).
// AStages gates whole items only, so levels are capped here. Without a player (or with a fake player) the era-0 cap applies.
(() => {
  const LootContextUtils = Java.loadClass('com.almostreliable.lootjs.util.LootContextUtils')
  const EnchantmentHelper = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper')
  const DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')

  // Values live in gg_fixes-difficulty.toml [loot] (reloads without a restart); index = era, 0 = no cap.
  // These defaults only cover a missing gg-fixes.
  const DEFAULT_CAP_BY_ERA = [2, 2, 3, 3, 4, 4, 5, 5, 0, 0, 0]
  let Config = null
  try {
    Config = Java.loadClass('gearsandgrimoires.fixes.difficulty.DifficultyConfig')
  } catch (err) {
    console.warn(`[loot] gg-fixes config not available, enchantment cap uses defaults: ${err}`)
  }

  const capOf = ctx => {
    const player = LootContextUtils.getPlayerOrNull(ctx)
    const era = player == null ? 0 : global.ggEras.eraOf(player)
    if (Config != null) return Config.lootEnchantCap(era)
    return DEFAULT_CAP_BY_ERA[Math.max(0, Math.min(era, DEFAULT_CAP_BY_ERA.length - 1))]
  }

  const capMutable = (mutable, cap) => {
    mutable.keySet().toArray().forEach(holder => {
      if (mutable.getLevel(holder) > cap) mutable.set(holder, cap)
    })
  }

  const enchanted = stack => stack.has(DataComponents.ENCHANTMENTS) || stack.has(DataComponents.STORED_ENCHANTMENTS)

  // The era lookup runs only when the loot holds an enchanted item, so plain mob drops (farms) cost one check per stack.
  const capBucket = (ctx, bucket) => {
    let cap = -1
    bucket.modifyItems(stack => {
      if (!enchanted(stack)) return stack
      if (cap < 0) cap = capOf(ctx)
      if (cap > 0) EnchantmentHelper.updateEnchantments(stack, mutable => capMutable(mutable, cap))
      return stack
    })
  }

  LootJS.modifiers(event => {
    event.addTableModifier(LootType.CHEST, LootType.ENTITY, LootType.FISHING, LootType.ARCHAEOLOGY,
      LootType.VAULT, LootType.GIFT, LootType.PIGLIN_BARTER)
      .customAction(capBucket)
  })
})()
