// Colony crafters do not learn Every Compat variants: builders never request them (styles use vanilla and
// Domum blocks), and they were ~27.8k of MineColonies' JEI crafter recipes, ~0.63M item stacks on the client
// (opt-memory heap dump, 14.11.2026). Players still craft them by hand.
(() => {
  const EVERY_COMPAT = /^everycomp:/
  const CRAFTERS = ['sawmill', 'fletcher', 'stonemason', 'glassblower']
  ServerEvents.tags('item', event => {
    CRAFTERS.forEach(crafter => event.add(`minecolonies:${crafter}_product_excluded`, EVERY_COMPAT))
  })
})()
