// Era seals (docs/plans/eras.md 6.2). The seal of era N is made in era N-1, in a machine of that era, from products of
// several systems at once, and from era 3 on it takes trophies of two different bosses of era N-1 (P1): group A is listed
// here, group B is every other boss of that era in global.ggErasData.BOSS_ERAS, so the boss table still drives the recipes.
// Every ingredient and resource must be available in era N-1 (dev/recipe-audit/item_eras.json and the resource table in
// eras.md 6.8).
ServerEvents.recipes(event => {
  const bossEras = global.ggErasData.BOSS_ERAS

  const trophy = bosses => ({
    type: 'neoforge:compound',
    children: bosses.map(id => ({
      type: 'neoforge:components',
      items: 'gg:trofeum',
      components: { 'minecraft:custom_data': { boss: id } },
      strict: false,
    })),
  })
  const trophies = (era, groupA) => {
    const groupB = Object.keys(bossEras).filter(id => bossEras[id] === era && groupA.indexOf(id) < 0)
    groupA.forEach(id => { if (bossEras[id] !== era) console.warn(`[seals] ${id} is not a boss of era ${era}`) })
    return [trophy(groupA), trophy(groupB)]
  }

  const item = id => ({ item: id })
  const repeat = (ingredient, n) => {
    const list = []
    for (let i = 0; i < n; i++) list.push(ingredient)
    return list
  }
  const fluid = (id, amount) => ({ type: 'neoforge:single', amount: amount, fluid: id })
  const fluidTag = (id, amount) => ({ type: 'neoforge:tag', amount: amount, tag: id })
  const seal = era => `gg:pieczec_${era}`

  // Create sequenced assembly where every step but pressing deploys one ingredient (or fills one fluid) onto the seal.
  const assembly = (era, base, steps) => {
    const partial = { item: `gg:niedokonczona_pieczec_${era}` }
    const out = [{ id: partial.item }]
    event.custom({
      type: 'create:sequenced_assembly',
      ingredient: base,
      transitional_item: { id: partial.item },
      sequence: steps.map(step => {
        if (step === 'press') return { type: 'create:pressing', ingredients: [partial], results: out }
        if (step.amount) return { type: 'create:filling', ingredients: [partial, step], results: out }
        return { type: 'create:deploying', ingredients: [partial, step], results: out }
      }),
      results: [{ id: seal(era), count: 1 }],
      loops: 1,
    }).id(`gg:seal/${era}`)
  }

  const apparatus = (era, reagent, pedestals, source) => event.custom({
    type: 'ars_nouveau:enchanting_apparatus',
    reagent: reagent,
    pedestalItems: pedestals,
    result: { id: seal(era), count: 1 },
    sourceCost: source,
    keepNbtOfReagent: false,
  }).id(`gg:seal/${era}`)

  const mechanical = (era, pattern, key) => event.custom({
    type: 'create:mechanical_crafting',
    pattern: pattern,
    key: key,
    result: { id: seal(era), count: 1 },
    accept_mirrored: false,
  }).id(`gg:seal/${era}`)

  // 1 Andesite, made in the stone age from stone-tier resources only (eras.md 6.8: no diamond or redstone before era 1):
  // smelting, deep caves (lapis), a geode (spyglass), hunting (backpack), farming and a kitchen (stew from the cooking pot).
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['ALA', 'BPS', 'AKA'],
    key: {
      A: item('create:andesite_alloy'), L: item('minecraft:lapis_block'), B: item('sophisticatedbackpacks:backpack'),
      P: item('farmersdelight:beef_stew'), S: item('minecraft:spyglass'), K: item('notreepunchingremastered:copper_saw'),
    },
    result: { id: seal('andezyt'), count: 1 },
  }).id('gg:seal/andezyt')

  // 2 Runes: unheated Create mixing (blaze burners belong to era 3), with honey from bees and a villager trade.
  event.custom({
    type: 'create:mixing',
    ingredients: [].concat(
      repeat(item('minecraft:lapis_lazuli'), 4), repeat(item('minecraft:amethyst_shard'), 4), repeat(item('minecraft:gold_ingot'), 2),
      [item('minecraft:emerald'), item('minecraft:experience_bottle'), item('create:andesite_casing'), fluidTag('c:honey', 500)]),
    results: [{ id: seal('runy'), count: 1 }],
  }).id('gg:seal/runy')

  // 3 Brass: Ars Nouveau apparatus with Create machines on the pedestals.
  const era2 = trophies(2, ['twilightforest:naga', 'twilightforest:lich'])
  apparatus('mosiadz', item('create:andesite_casing'), [
    era2[0], era2[1], item('irons_spellbooks:arcane_essence'), item('irons_spellbooks:arcane_essence'),
    item('ars_nouveau:source_gem_block'), item('create:mechanical_press'), item('create:water_wheel'), item('minecraft:diamond'),
  ], 5000)

  // 4 Occult: brass-era Create line (deployers, spout, press) fed with Nether products.
  const era3 = trophies(3, ['twilightforest:minoshroom', 'twilightforest:hydra'])
  assembly('okultyzm', item('create:brass_casing'), [
    item('create:precision_mechanism'), item('minecraft:blaze_rod'), fluid('minecraft:lava', 500), 'press',
    item('create:electron_tube'), era3[0], era3[1],
  ])

  // 5 Steam and Steel: Malum spirit infusion; the steam engine is the tech product of the brass era.
  const era4 = trophies(4, ['minecraft:wither', 'bosses_of_mass_destruction:gauntlet'])
  event.custom({
    type: 'malum:spirit_infusion',
    input: { count: 4, item: 'malum:soul_stained_steel_ingot' },
    extraInputs: [
      { count: 2, item: 'occultism:spirit_attuned_gem' }, { count: 4, item: 'eidolon_repraised:arcane_gold_ingot' },
      { count: 2, item: 'create:precision_mechanism' }, { count: 1, item: 'create:steam_engine' },
      Object.assign({ count: 1 }, era4[0]), Object.assign({ count: 1 }, era4[1]),
    ],
    spirits: [{ type: 'malum:infernal', count: 16 }, { type: 'malum:arcane', count: 16 }, { type: 'malum:wicked', count: 8 }],
    result: { id: seal('para'), count: 1 },
  }).id('gg:seal/para')

  // 6 Arcana: 5x5 Create mechanical crafting from the steel era (TFMG, diesel).
  const era5 = trophies(5, ['aether:slider', 'aether:valkyrie_queen', 'aether:sun_spirit', 'deep_aether:eots_controller'])
  mechanical('arkana', [' SCS ', 'SPHPS', 'CTDUC', 'SPHPS', ' SCS '], {
    S: item('tfmg:steel_ingot'), C: item('tfmg:steel_casing'), P: item('create:precision_mechanism'),
    H: item('tfmg:heavy_machinery_casing'), D: item('createdieselgenerators:diesel_engine'), T: era5[0], U: era5[1],
  })

  // 7 Electricity: a full Ars source jar and arcane-era metals, with a steel casing as the tech part.
  const era6 = trophies(6, ['cataclysm:ignis', 'cataclysm:netherite_monstrosity'])
  apparatus('elektrycznosc', item('forbidden_arcanus:arcane_crystal'), [
    era6[0], era6[1], item('forbidden_arcanus:deorum_ingot'), item('forbidden_arcanus:deorum_ingot'),
    item('theurgy:mercury_shard'), item('theurgy:mercury_shard'), item('ars_elemental:mark_of_mastery'), item('tfmg:steel_casing'),
  ], 10000)

  // 8 Atom: electric-era Create line combining AE2, Mekanism, Create Crafts & Additions and New Age.
  const era7 = trophies(7, ['undergarden:forgotten_guardian', 'minecraft:warden'])
  assembly('atom', item('mekanism:steel_casing'), [
    item('ae2:engineering_processor'), item('mekanism:elite_control_circuit'), item('createaddition:capacitor'),
    item('create_new_age:copper_circuit'), 'press', item('malum:hallowed_gold_ingot'), era7[0], era7[1],
  ])

  // 9 Transcendence: 5x5 mechanical crafting with the atomic and End products.
  const era8 = trophies(8, ['minecraft:ender_dragon', 'cataclysm:ender_guardian', 'bosses_of_mass_destruction:obsidilith', 'goety:ender_keeper'])
  mechanical('transcendencja', ['DAUAD', 'APXPA', 'UTMVU', 'APXPA', 'DAUAD'], {
    D: item('forbidden_arcanus:deorum_ingot'), A: item('eternal_starlight:aethersent_ingot'), U: item('mekanism:pellet_polonium'),
    P: item('mekanism:ultimate_control_circuit'), X: item('megacells:cell_component_256m'), M: item('mekanism:pellet_antimatter'),
    T: era8[0], V: era8[1],
  })

  // Finale: the seven quest tree badges (docs/plans/quests.md, section 8) around Mahou Tsukai mana circuits, the era-9 content.
  const era9 = trophies(9, ['cataclysm:the_leviathan', 'cataclysm:scylla'])
  mechanical('final', ['T M G', 'CDXDC', 'S M B', 'CDYDC', 'W K O'], {
    T: item('gg:odznaka_technika'), G: item('gg:odznaka_magia'), S: item('gg:odznaka_magazyny'), B: item('gg:odznaka_budowanie'),
    W: item('gg:odznaka_swiat'), K: item('gg:odznaka_kolonia'), O: item('gg:odznaka_bossowie'),
    M: item('mahoutsukai:mana_circuit'), C: item('mahoutsukai:mana_circuit_magitech'), D: item('mahoutsukai:attuned_diamond'),
    X: era9[0], Y: era9[1],
  })
})
