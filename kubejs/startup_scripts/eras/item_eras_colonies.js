// Colony hut eras come from the MineColonies topic's table (startup_scripts/colonies/huts.js), loaded before this directory.
if (global.ggColonyHuts && global.ggErasItems) {
  global.ggColonyHuts.HUTS.forEach(hut => {
    if (hut.era >= 1) global.ggErasItems[hut.id] = hut.era
  })
}
