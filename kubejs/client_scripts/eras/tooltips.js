// Era line on items that belong to an era (docs/plans/eras.md, decision D2: show future items, do not hide them).
// The line is dynamic: it reads the player's AStages stages, so it turns into a lock warning only while the team lacks the era.
// One handler for all items with a map lookup: an item-list filter is tested linearly per tooltip, and the creative search
// builds tooltips for every item, which froze it.
ItemEvents.modifyTooltips(event => {
  event.modifyAll(tooltip => tooltip.dynamic('gg_era'))
  event.modify('gg:trofeum', tooltip => tooltip.dynamic('gg_trophy'))
})

// Seal recipes show trophies with only custom_data, so the boss is named here rather than by the item name.
ItemEvents.dynamicTooltips('gg_trophy', event => {
  const DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
  const data = event.item.get(DataComponents.CUSTOM_DATA)
  if (data == null) return
  const boss = String(data.copyTag().getString('boss'))
  if (boss.indexOf(':') < 0) return
  const era = global.ggErasData.BOSS_ERAS[boss]
  const name = Text.translate(`entity.${boss.replace(':', '.')}`).gold()
  const line = era === undefined
    ? Text.translatable('gg.era.tooltip.boss', name)
    : Text.translatable('gg.era.tooltip.boss_era', name, global.ggEras.eraText(global.ggErasData.ERAS[era]))
  event.add([line.gray()])
})

ItemEvents.dynamicTooltips('gg_era', event => {
  const n = (global.ggErasItems || {})[String(event.item.id)]
  if (n === undefined) return
  const era = global.ggErasData.ERAS[n]
  if (AStagesClient.playerHasStage(era.stage)) {
    event.add([global.ggEras.eraText(era).gray()])
  } else {
    event.add([Text.translatable('gg.era.tooltip.locked').red().bold()
      .append(Text.translatable('gg.era.tooltip.requires', global.ggEras.eraText(era)).red())])
  }
})
