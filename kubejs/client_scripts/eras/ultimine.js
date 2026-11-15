// Client half of the Ultimine pacing (see server_scripts/eras/ultimine.js): the client predicts block breaking itself,
// so it must slow the first block by the same factor as the server.
(() => {
  const FTBUltimineClient = Java.loadClass('dev.ftb.mods.ftbultimine.client.FTBUltimineClient')
  const BreakSpeed = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$BreakSpeed')
  const firstEraStage = global.ggErasData.ERAS[1].stage

  NativeEvents.onEvent(BreakSpeed, event => {
    const player = event.getEntity()
    if (!player.level.isClientSide() || player.isCreative()) return
    const pos = event.getPosition().orElse(null)
    if (pos == null || !AStagesClient.playerHasStage(firstEraStage)) return
    const selected = FTBUltimineClient.getInstance().getSelectedBlocks()
    event.setNewSpeed(global.ggUltimine.pacedSpeed(player, player.level, pos, selected, event.getNewSpeed()))
  })
})()
