// FTB Ultimine pacing (docs/plans/eras.md 6.7, task e4-08): an Ultimine run takes as long as mining every selected block
// one by one. Server and client slow the first block by the same factor; a mismatch would make the server reject the break.
(() => {
  // getDestroyProgress fires BreakSpeed again; the flag keeps the nested calls at normal speed.
  let measuring = false

  const ticksFor = (player, level, pos) => {
    const progress = level.getBlockState(pos).getDestroyProgress(player, level, pos)
    if (progress <= 0) return 0
    return progress >= 1 ? 1 : Math.ceil(1 / progress)
  }

  const measure = (player, level, pos, positions) => {
    let total = 0
    positions.forEach(p => { total += ticksFor(player, level, p) })
    return { total: total, origin: ticksFor(player, level, pos) }
  }

  // Break speed for `pos` within the Ultimine selection; unchanged when pos is not part of a multi-block selection.
  const pacedSpeed = (player, level, pos, positions, speed) => {
    if (measuring || positions == null || positions.size() < 2 || !positions.contains(pos)) return speed
    measuring = true
    let ticks = null
    try { ticks = measure(player, level, pos, positions) } finally { measuring = false }
    return ticks.origin > 0 && ticks.total > ticks.origin ? speed * ticks.origin / ticks.total : speed
  }

  global.ggUltimine = { pacedSpeed: pacedSpeed }
})()
