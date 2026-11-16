// priority: 1000
// Wires the team era sync (startup_scripts/eras/api.js) to player events. Loads first so listeners from other
// server scripts are registered after the reset on every /reload.
global.ggEras.resetListeners()

PlayerEvents.loggedIn(event => {
  global.ggEras.syncPlayer(event.player)
  global.ggEras.remind(event.player)
})

PlayerEvents.tick(event => {
  if (event.player.level.isClientSide()) return
  if (event.player.tickCount % 40 === 0) global.ggEras.syncPlayer(event.player)
})
