// Apotheosis world tier follows the team era (docs/plans/loot-difficulty.md, section B). Manual tier changes are off in
// config/apotheosis/apotheosis.cfg, so this script is the only writer. The unlock advancements are overridden with
// minecraft:impossible and granted here only to keep the tier screen consistent with the forced tier.
(() => {
  const WorldTier = Java.loadClass('dev.shadowsoffire.apotheosis.tiers.WorldTier')
  const ORDER = ['HAVEN', 'FRONTIER', 'ASCENT', 'SUMMIT', 'PINNACLE']
  const TIER_BY_ERA = ['HAVEN', 'HAVEN', 'FRONTIER', 'FRONTIER', 'ASCENT', 'ASCENT', 'SUMMIT', 'SUMMIT', 'PINNACLE', 'PINNACLE', 'PINNACLE']
  // Catches team joins and the leave-team choice (eras.md 6.1), which do not fire onEraChanged for the player.
  const CHECK_EVERY_TICKS = 200
  let ticks = 0
  let errorLogged = false

  const setUnlock = (player, rank, tier) => {
    const id = `apotheosis:progression/${tier.toLowerCase()}`
    const should = ORDER.indexOf(tier) <= rank
    const has = player.isAdvancementDone(id)
    if (should && !has) player.unlockAdvancement(id)
    else if (!should && has) player.revokeAdvancement(id)
  }

  const sync = player => {
    const era = Math.max(0, Math.min(global.ggEras.eraOf(player), TIER_BY_ERA.length - 1))
    const want = TIER_BY_ERA[era]
    const rank = ORDER.indexOf(want)
    ORDER.slice(1).forEach(tier => setUnlock(player, rank, tier))
    if (String(WorldTier.getTier(player).name()) !== want) WorldTier.setTier(player, WorldTier.valueOf(want))
  }

  const safeSync = player => {
    try {
      sync(player)
    } catch (err) {
      if (!errorLogged) console.error(`[difficulty] world tier sync failed for ${player.username}: ${err}`)
      errorLogged = true
    }
  }

  global.ggEras.onEraChanged((team, from, to) => team.getOnlineMembers().forEach(p => safeSync(p)))

  PlayerEvents.loggedIn(event => safeSync(event.player))

  ServerEvents.tick(event => {
    ticks++
    if (ticks < CHECK_EVERY_TICKS) return
    ticks = 0
    event.server.players.forEach(p => safeSync(p))
  })
})()
