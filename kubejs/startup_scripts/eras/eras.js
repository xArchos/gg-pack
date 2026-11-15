// priority: 100
// Era definitions (docs/plans/eras.md, section 1). Startup scripts run on both sides, so server and client read the same data.
(() => {
  const names = [
    ['kamien', 'Era Kamienia'],
    ['andezyt', 'Era Andezytu'],
    ['runy', 'Era Run'],
    ['mosiadz', 'Era Mosiądzu'],
    ['okultyzm', 'Era Okultyzmu'],
    ['para', 'Era Pary i Stali'],
    ['arkana', 'Era Arkanów'],
    ['elektrycznosc', 'Era Elektryczności'],
    ['atom', 'Era Atomu'],
    ['transcendencja', 'Era Transcendencji'],
    ['final', 'Finał'],
  ]
  const eras = []
  for (let n = 0; n < names.length; n++) {
    eras.push({ n: n, id: names[n][0], name: names[n][1], stage: n === 0 ? null : 'era_' + names[n][0] })
  }

  const dimensions = {
    'minecraft:overworld': 0,
    'twilightforest:twilight_forest': 2,
    'minecraft:the_nether': 3,
    'the_bumblezone:the_bumblezone': 3,
    'aether:the_aether': 5,
    'undergarden:undergarden': 7,
    'deeperdarker:otherside': 7,
    'minecraft:the_end': 8,
    'eternal_starlight:starlight': 8,
  }
  const northstar = ['earth_orbit', 'moon', 'mars', 'mars_orbit', 'venus', 'venus_orbit', 'mercury', 'mercury_orbit']
  northstar.forEach(d => { dimensions['northstar:' + d] = 8 })

  // docs/plans/eras.md 6.2a: the era in which a team is meant to beat the boss; seal N+1 needs a trophy from era N.
  const bossesByEra = {
    2: ['twilightforest:naga', 'twilightforest:lich', 'ars_nouveau:wilden_boss', 'irons_spellbooks:dead_king'],
    3: ['twilightforest:minoshroom', 'twilightforest:hydra', 'bosses_of_mass_destruction:lich', 'bosses_of_mass_destruction:void_blossom',
      'mowziesmobs:ferrous_wroughtnaut', 'mowziesmobs:frostmaw', 'mowziesmobs:umvuthi', 'aquamirae:captain_cornelia',
      'born_in_chaos_v1:lord_pumpkinhead', 'illagerinvasion:invoker'],
    4: ['minecraft:wither', 'bosses_of_mass_destruction:gauntlet', 'goety:apostle', 'irons_spellbooks:fire_boss',
      'twilightforest:knight_phantom', 'twilightforest:ur_ghast'],
    5: ['aether:slider', 'aether:valkyrie_queen', 'aether:sun_spirit', 'deep_aether:eots_controller', 'mowziesmobs:sculptor',
      'twilightforest:alpha_yeti', 'twilightforest:snow_queen'],
    6: ['cataclysm:ignis', 'cataclysm:netherite_monstrosity', 'cataclysm:ancient_remnant', 'discerning_the_eldritch:ascended_one'],
    7: ['undergarden:forgotten_guardian', 'minecraft:warden', 'deeperdarker:stalker', 'goety:vizier', 'goety:hostile_redstone_monstrosity'],
    8: ['minecraft:ender_dragon', 'cataclysm:ender_guardian', 'bosses_of_mass_destruction:obsidilith', 'goety:ender_keeper',
      'eternal_starlight:the_gatekeeper', 'eternal_starlight:starlight_golem', 'eternal_starlight:lunar_monstrosity'],
    9: ['cataclysm:the_leviathan', 'cataclysm:the_harbinger', 'cataclysm:maledictus', 'cataclysm:scylla', 'gametechbcs_spellbooks:hard_dead_king'],
  }
  const bosses = {}
  Object.keys(bossesByEra).forEach(n => bossesByEra[n].forEach(id => { bosses[id] = parseInt(n) }))
  // Entities that take over a listed boss mid-fight (the mod discards the previous phase, so only the last one dies):
  // their death credits the listed boss.
  const bossPhases = {
    'born_in_chaos_v1:lord_pumpkinhead_withouta_horse': 'born_in_chaos_v1:lord_pumpkinhead',
    'born_in_chaos_v1:lord_pumpkinhead_head': 'born_in_chaos_v1:lord_pumpkinhead',
  }
  // Body parts with their own health that die one by one while the listed boss lives on: no credit for their deaths.
  const bossParts = {
    'deep_aether:eots_segment': 'deep_aether:eots_controller',
  }

  global.ggErasData = {
    ERAS: eras, STAGE_PREFIX: 'era_', DIMENSION_ERAS: dimensions, BOSS_ERAS: bosses, BOSS_PHASES: bossPhases, BOSS_PARTS: bossParts,
  }
})()
