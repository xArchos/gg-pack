// Boss scaling by players in the fight and by how far the team's era is past the boss era
// (docs/plans/loot-difficulty.md, section D). Bosses are found by scanning around players, not on spawn: structure bosses
// spawn at world generation with nobody nearby, and a spawn hook would run for every entity in the world.
// Multipliers only grow during a fight and keep the health percentage, so walking out of range gains nothing.
// A survival player below the boss era in the fight multiplies its damage and divides the damage it takes (user decision
// 15.11); that penalty lasts only while such a player is near, so a ready team later meets the normal boss. Dividing incoming
// damage instead of raising max health avoids the vanilla 1024 cap on that attribute.
// KubeJS hides getType/getUUID/level/players() behind properties and Rhino picks the wrong EntityType.is() overload
// (see eras/bosses.js), hence the properties and the id set read from the tag.
(() => {
  const TagKey = Java.loadClass('net.minecraft.tags.TagKey')
  const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const Attributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')
  const AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
  const Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
  const LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
  const Component = Java.loadClass('net.minecraft.network.chat.Component')
  const TitlePacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundSetTitleTextPacket')
  const SubtitlePacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundSetSubtitleTextPacket')
  const TitleTimesPacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundSetTitlesAnimationPacket')

  const BOSSES = TagKey.create(Registries.ENTITY_TYPE, ResourceLocation.parse('gg:scaled_bosses'))
  const MODIFIER = ResourceLocation.parse('gg:boss_scaling')
  const EVERY_TICKS = 100
  const NOTICE_MS = 60000
  // Values live in gg_fixes-difficulty.toml [bosses] (reloads without a restart); these defaults only cover a missing gg-fixes.
  const DEFAULTS = {
    hpPerPlayer: 0.75,
    dmgPerPlayer: 0.1,
    hpPerEra: 0.25,
    dmgPerEra: 0.15,
    maxEraDiff: 4,
    countRadius: 48,
    engageRadius: 32,
    maxPlayers: 8,
    underEraMultiplier: 1.0,
  }
  let Config = null
  try {
    Config = Java.loadClass('gearsandgrimoires.fixes.difficulty.DifficultyConfig')
  } catch (err) {
    console.warn(`[difficulty] gg-fixes config not available, boss scaling uses defaults: ${err}`)
  }
  const settings = () => Config == null ? DEFAULTS : {
    hpPerPlayer: Config.bossHpPerPlayer(),
    dmgPerPlayer: Config.bossDmgPerPlayer(),
    hpPerEra: Config.bossHpPerEra(),
    dmgPerEra: Config.bossDmgPerEra(),
    maxEraDiff: Config.bossMaxEraDiff(),
    countRadius: Config.bossCountRadius(),
    engageRadius: Config.bossEngageRadius(),
    maxPlayers: Config.bossMaxPlayers(),
    underEraMultiplier: Config.bossUnderEraMultiplier(),
  }
  // Iron's bosses already add +40% health per extra nearby player at spawn (hard-coded, no config), so here they get only
  // the era part; otherwise 8 players would give them ×23.75 health.
  const SCALES_ITSELF = {
    'irons_spellbooks:dead_king': true,
    'irons_spellbooks:fire_boss': true,
    'gametechbcs_spellbooks:hard_dead_king': true,
  }
  let S = DEFAULTS
  let ticks = 0
  let bossIds = null
  const notices = {}

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
  const isBoss = entity => (bossIds || loadBossIds())[String(entity.type)] === true

  const distance = (a, b) => Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z))

  const fighters = boss => {
    const out = []
    boss.level.players.forEach(p => {
      if (p.isAlive() && !p.isSpectator() && distance(p, boss) <= S.countRadius) out.push(p)
    })
    return out
  }

  const raise = (boss, hpMul, dmgMul) => {
    const data = boss.persistentData
    const oldHp = data.contains('gg_hp_mul') ? data.getDouble('gg_hp_mul') : 1
    const oldDmg = data.contains('gg_dmg_mul') ? data.getDouble('gg_dmg_mul') : 1
    if (dmgMul > oldDmg) data.putDouble('gg_dmg_mul', dmgMul)
    if (hpMul <= oldHp) return
    const ratio = boss.health / boss.maxHealth
    boss.getAttribute(Attributes.MAX_HEALTH)
      .addOrReplacePermanentModifier(new AttributeModifier(MODIFIER, hpMul - 1, Operation.ADD_MULTIPLIED_TOTAL))
    boss.health = ratio * boss.maxHealth
    data.putDouble('gg_hp_mul', hpMul)
  }

  const setUnderEra = (boss, mul) => {
    const data = boss.persistentData
    if (mul > 1) data.putDouble('gg_under_era', mul)
    else if (data.contains('gg_under_era')) data.remove('gg_under_era')
  }

  // One notice per main boss: phases (Lord Pumpkinhead) and parts (EOTS segments) are separate entities of one fight.
  const warn = (player, boss, bossEra, mul) => {
    const main = global.ggEras.mainBoss(String(boss.type))
    const key = `${player.uuid}/${main}`
    const now = Date.now()
    if (notices[key] !== undefined && now - notices[key] < NOTICE_MS) return
    notices[key] = now
    const name = BuiltInRegistries.ENTITY_TYPE.get(ResourceLocation.parse(main)).getDescription()
    const eraData = global.ggErasData.ERAS[bossEra]
    const era = Component.translatableWithFallback(`gg.era.${eraData.id}`, eraData.name)
    player.connection.send(new TitleTimesPacket(10, 70, 20))
    // Text.of(...).red(): MutableComponent.withStyle is overloaded and Rhino cannot pick one.
    player.connection.send(new TitlePacket(
      Text.of(Component.translatableWithFallback('gg.boss.under_era.title', 'Za wcześnie na tę walkę')).darkRed()))
    player.connection.send(new SubtitlePacket(
      Text.of(Component.translatableWithFallback('gg.boss.under_era.subtitle', '%s · wymagana %s', name, era)).red()))
    player.tell(Text.of(Component.translatableWithFallback('gg.boss.under_era.chat',
      '%s: za wcześnie na tę walkę. Wymagana %s; do tego czasu boss ma ×%s życia i obrażeń.',
      name, era, String(Math.round(mul * 10) / 10))).red())
  }

  // The lowest era decides, so a player from a later era cannot carry a teammate through a boss early.
  const underEra = (boss, players, bossEra) => {
    const mul = S.underEraMultiplier
    const behind = bossEra < 0 || mul <= 1 ? [] : players.filter(p => !p.isCreative() && global.ggEras.eraOf(p) < bossEra)
    setUnderEra(boss, behind.length > 0 ? mul : 1)
    behind.forEach(p => warn(p, boss, bossEra, mul))
  }

  const scale = boss => {
    const players = fighters(boss)
    if (players.length === 0) return
    const n = SCALES_ITSELF[String(boss.type)] ? 1 : Math.min(players.length, S.maxPlayers)
    let teamEra = 0
    players.forEach(p => { teamEra = Math.max(teamEra, global.ggEras.eraOf(p)) })
    const bossEra = global.ggEras.bossEra(String(boss.type))
    const diff = bossEra < 0 ? 0 : Math.max(0, Math.min(teamEra - bossEra, S.maxEraDiff))
    raise(boss,
      (1 + S.hpPerPlayer * (n - 1)) * (1 + S.hpPerEra * diff),
      (1 + S.dmgPerPlayer * (n - 1)) * (1 + S.dmgPerEra * diff))
    underEra(boss, players, bossEra)
  }

  const scanAround = (player, done) => {
    player.level.getEntitiesOfClass(LivingEntity, player.boundingBox.inflate(S.engageRadius), e => isBoss(e))
      .forEach(boss => {
        const key = String(boss.uuid)
        if (done[key] || !boss.isAlive()) return
        done[key] = true
        scale(boss)
      })
  }

  const forgetOldNotices = () => {
    const now = Date.now()
    Object.keys(notices).forEach(k => {
      if (now - notices[k] > NOTICE_MS) delete notices[k]
    })
  }

  ServerEvents.tick(event => {
    ticks++
    if (ticks < EVERY_TICKS) return
    ticks = 0
    S = settings()
    forgetOldNotices()
    const done = {}
    event.server.players.forEach(p => scanAround(p, done))
  })

  // DamageSource.getEntity() is the owner for projectiles and most spells, so ranged attacks scale too.
  EntityEvents.beforeHurt('minecraft:player', event => {
    const attacker = event.source.actual
    if (!attacker) return
    const data = attacker.persistentData
    let mul = 1
    if (data.contains('gg_dmg_mul')) mul = mul * data.getDouble('gg_dmg_mul')
    if (data.contains('gg_under_era')) mul = mul * data.getDouble('gg_under_era')
    if (mul !== 1) event.damage = event.damage * mul
  })

  EntityEvents.beforeHurt(event => {
    const data = event.entity.persistentData
    if (data.contains('gg_under_era')) event.damage = event.damage / data.getDouble('gg_under_era')
  })
})()
