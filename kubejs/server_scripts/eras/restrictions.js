// AStages restrictions per era (docs/plans/eras.md 6.3). Item restrictions come from the generated map in startup_scripts/eras.
(() => {
  const data = global.ggErasData

  data.ERAS.forEach(era => {
    if (era.stage) AStages.customizeStage(era.stage, era.name)
  })

  // Future-era items: unusable, but they can still be picked up, carried and stored, so trading raw goods keeps working.
  // Their blocks stay breakable: worldgen is full of mod blocks with a later era, and ores are gated by the pickaxe ladder.
  const items = global.ggErasItems || {}
  const byEra = {}
  Object.keys(items).forEach(id => {
    const n = items[id]
    if (!byEra[n]) byEra[n] = []
    byEra[n].push(id)
  })
  Object.keys(byEra).forEach(n => {
    const era = data.ERAS[n]
    const message = stack => Text.translatable('gg.era.item_locked', global.ggEras.eraText(era)).red()
    AStages.addRestrictionForItem(`gg_items_${era.id}`, era.stage, byEra[n])
      .allowPickup()
      .allowInventoryStorage()
      .allowContainerStorage()
      .allowMining()
      .showInRecipeViewer()
      .globalShowName()
      .showTooltip()
      .useMessage(message)
      .placeMessage(message)
      .attackMessage(message)
  })

  Object.keys(data.DIMENSION_ERAS).forEach(dim => {
    const era = data.ERAS[data.DIMENSION_ERAS[dim]]
    if (!era.stage) return
    // Bidirectional: a player who loses an era while inside the dimension must still be able to leave it.
    AStages.addRestrictionForDimension(`gg_dim_${dim.replace(':', '_')}`, era.stage, dim)
      .allowBidirectional()
      .enterMessage(loc => Text.translatable('gg.era.dimension_locked', global.ggEras.eraText(era)).red())
  })
})()
