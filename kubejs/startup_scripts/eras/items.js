// Era seals (docs/plans/eras.md 6.2) and the boss trophy (6.2a). The trophy carries the boss id in minecraft:custom_data,
// so one item serves every boss and seal recipes match it with a neoforge:components ingredient.
StartupEvents.registry('item', event => {
  global.ggErasData.ERAS.forEach(era => {
    if (era.n === 0) return
    event.create(`gg:pieczec_${era.id}`).maxStackSize(16).rarity(era.n >= 9 ? 'epic' : 'rare')
  })
  event.create('gg:trofeum').maxStackSize(64).rarity('uncommon')
  // Transitional items of the seals made by Create sequenced assembly (server_scripts/recipes/eras/seals.js).
  event.create('gg:niedokonczona_pieczec_okultyzm').maxStackSize(1)
  event.create('gg:niedokonczona_pieczec_atom').maxStackSize(1)
  // Holds a looted item from a future era until the team reaches it (docs/plans/loot-difficulty.md A4a). No recipe:
  // only the loot topic creates it, and it must survive lava like the item it replaces might.
  event.create('gg:zapieczetowany_lup').maxStackSize(1).fireResistant().rarity('uncommon')
  // Quest tree badges (docs/plans/quests.md, section 8): the last quest of each tree gives one; all seven make the finale seal.
  const trees = ['technika', 'magia', 'magazyny', 'budowanie', 'swiat', 'bossowie', 'kolonia']
  trees.forEach(tree => event.create(`gg:odznaka_${tree}`).maxStackSize(16).rarity('epic'))
})
