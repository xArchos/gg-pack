// Colony buildings per era (docs/plans/minecolonies.md §3). Single source for colony research gating
// (server_scripts/colonies/eras.js) and for hut items in the eras item map (eras/item_eras_colonies.js).
(() => {
  const huts = []
  // 'basic' levels rise in tech eras, 'magic' in magic eras; the builder and university use the
  // higher track so they never cap the other buildings.
  const add = (names, era, track) => names.forEach(name => {
    huts.push({ id: name.indexOf(':') < 0 ? 'minecolonies:blockhut' + name : name, era: era, track: track })
  })
  add(['townhall', 'citizen', 'warehouse', 'deliveryman', 'tavern', 'hospital', 'farmer', 'plantation', 'composter',
    'fisherman', 'lumberjack', 'miner', 'beekeeper', 'shepherd', 'cowboy', 'chickenherder', 'swineherder', 'rabbithutch',
    'cook', 'kitchen', 'baker', 'sawmill', 'stonemason', 'guardtower'], 1, 'basic')
  add(['builder', 'university'], 1, 'magic')
  add(['library', 'school', 'enchanter', 'mysticalsite', 'florist'], 2, 'magic')
  add(['blacksmith', 'mechanic', 'smeltery', 'stonesmeltery', 'crusher', 'sifter', 'glassblower', 'dyer', 'fletcher',
    'barracks', 'archery', 'combatacademy', 'thesettler_x_create:blockhutcreateshop'], 3, 'basic')
  add(['netherworker'], 4, 'basic')
  add(['alchemist', 'graveyard'], 4, 'magic')
  add(['concretemixer', 'gatehouse', 'stable'], 5, 'basic')

  global.ggColonyHuts = {
    HUTS: huts,
    // Max building level per era number (0 = stone age, 10 = finale).
    CAPS: {
      basic: [0, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5],
      magic: [0, 2, 2, 3, 4, 4, 5, 5, 5, 5, 5],
    },
    // Tier 6 researches need this era (minecolonies.md §3, row 8).
    CAPSTONE_ERA: 8,
  }
})()
