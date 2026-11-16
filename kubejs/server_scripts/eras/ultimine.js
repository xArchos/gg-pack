// FTB Ultimine (docs/plans/eras.md 6.7, task e4-08): available from era 1; an Ultimine run takes as long as mining the
// selected blocks one by one (startup_scripts/eras/ultimine_pacing.js, mirrored in client_scripts/eras/ultimine.js).
// Tool wear and vanilla hunger are applied per block by Ultimine itself; its extra hunger is off in ftbultimine-server.snbt.
(() => {
  const FTBUltimine = Java.loadClass('dev.ftb.mods.ftbultimine.FTBUltimine')
  const BreakSpeed = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$BreakSpeed')

  // In singleplayer the override is shared with the client thread; the server decides.
  FTBUltimine.setPermissionOverride(player => player.level.isClientSide() || global.ggEras.eraOf(player) >= 1)

  NativeEvents.onEvent(BreakSpeed, event => {
    const player = event.getEntity()
    if (player.level.isClientSide() || player.isCreative()) return
    const pos = event.getPosition().orElse(null)
    if (pos == null || global.ggEras.eraOf(player) < 1) return
    const data = FTBUltimine.getInstance().getOrCreatePlayerData(player)
    if (!data.isPressed()) return
    event.setNewSpeed(global.ggUltimine.pacedSpeed(player, player.level, pos, data.cachedPositions(), event.getNewSpeed()))
  })
})()
