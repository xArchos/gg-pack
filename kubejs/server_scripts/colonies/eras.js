// Colony buildings follow team eras (docs/plans/minecolonies.md). Hidden MineColonies researches "Era N"
// complete on their own once the colony owner's FTB team has the era stage (requirement gg_fixes:team_stage
// from gg-fixes). A hut research effect's strength is that building's max level, so these researches both
// unlock buildings and cap their levels.
(() => {
  // Kill switch for the era data; the refresh triggers and team colony limit are in config/gg_fixes-colonies.toml.
  const ENABLED = true
  const HUTS = global.ggColonyHuts
  const ERAS = global.ggErasData.ERAS
  const BRANCH = 'minecolonies:gg_eras'
  const HUT_LEVELS = [1, 2, 3, 4, 5]

  // 'ns:path' → 'ns:<folder>/path'
  const inFolder = (id, folder) => id.replace(':', `:${folder}/`)
  const effectId = hut => inFolder(hut, 'effects')
  const researchFile = id => inFolder(id, 'researches')
  const eraResearch = n => `${BRANCH}/era_${ERAS[n].id}`
  const copy = json => JSON.parse(JSON.stringify(json))

  ServerEvents.generateData('after_mods', event => {
    if (!ENABLED) return

    event.json(researchFile(BRANCH), {
      'branch-name': 'Ery kolonii',
      'branch-type': 'unlockables',
      'base-time': 0.0,
      hidden: true,
      sortOrder: 300,
    })

    HUTS.HUTS.forEach(hut => event.json(researchFile(effectId(hut.id)), { effect: true, levels: HUT_LEVELS }))

    for (let n = 1; n < ERAS.length; n++) {
      event.json(researchFile(eraResearch(n)), {
        branch: BRANCH,
        researchLevel: 1,
        sortOrder: n,
        name: ERAS[n].name,
        icon: 'minecolonies:blockhuttownhall',
        hidden: true,
        autostart: true,
        instant: true,
        'no-reset': true,
        requirements: [{ type: 'gg_fixes:team_stage', stage: ERAS[n].stage }],
        effects: HUTS.HUTS.filter(hut => hut.era <= n).map(hut => ({ id: effectId(hut.id), level: HUTS.CAPS[hut.track][n] })),
      })
    }

    // Default hut-unlock researches stay in the tree as plain prerequisites; with their hut effect
    // they would unlock a building before its era.
    const defaults = global.ggColonyDefaultResearch
    Object.keys(defaults.unlocks).forEach(id => {
      const research = copy(defaults.unlocks[id])
      research.effects = research.effects.filter(e => e.id.indexOf(':effects/blockhut') < 0)
      event.json(researchFile(id), research)
    })
    Object.keys(defaults.capstones).forEach(id => {
      const research = copy(defaults.capstones[id])
      research.requirements = (research.requirements || []).concat([{ type: 'minecolonies:research', research: eraResearch(HUTS.CAPSTONE_ERA) }])
      event.json(researchFile(id), research)
    })
  })

  // Top level on purpose: eras/api.js (priority 1000) rebuilds its listener list on every /reload,
  // so the listener must be registered again on each script load, not once in a server event.
  if (ENABLED && global.ggEras) {
    global.ggEras.onEraChanged(() => Java.loadClass('gearsandgrimoires.fixes.colonies.ColonyEras').refreshAll())
  }
})()
