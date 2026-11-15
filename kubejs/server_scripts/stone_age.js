// No Tree Punching only removes the drop; the pack blocks breaking logs without an axe entirely.
BlockEvents.broken(event => {
  const player = event.player
  if (!player || player.isCreative()) return
  if (!event.block.hasTag('minecraft:logs')) return
  if (player.mainHandItem.hasTag('minecraft:axes')) return
  player.setStatusMessage(Text.translatable('gg.stone_age.need_axe').red())
  event.cancel()
})

// Any axe that can fell a tree must also be able to cut planks (No Tree Punching recipes use c:tools/axes).
ServerEvents.tags('item', event => {
  event.add('c:tools/axes', '#minecraft:axes')
})

// No Tree Punching only covers vanilla woods; every other "1 log -> planks" recipe gets the same axe/saw rule.
ServerEvents.recipes(event => {
  const found = []
  event.forEachRecipe({ type: 'minecraft:crafting_shapeless', output: '#minecraft:planks' }, recipe => {
    const json = recipe.json
    const ingredients = json.getAsJsonArray('ingredients')
    if (ingredients.size() !== 1) return
    const result = json.getAsJsonObject('result')
    found.push({
      id: String(recipe.getId()),
      input: ingredients.get(0),
      output: String(result.get('id').getAsString()),
      count: result.has('count') ? result.get('count').getAsInt() : 1,
    })
  })
  found.forEach(r => {
    const name = r.id.replace(':', '/')
    event.remove({ id: r.id })
    event.custom({
      type: 'notreepunchingremastered:damage_tool_shapeless',
      category: 'misc',
      ingredients: [{ tag: 'c:tools/axes' }, r.input],
      result: { id: r.output, count: Math.max(1, Math.floor(r.count / 2)) },
    }).id(`kubejs:stone_age/planks_axe/${name}`)
    event.custom({
      type: 'notreepunchingremastered:damage_tool_shapeless',
      category: 'misc',
      ingredients: [{ tag: 'c:tools/saws' }, r.input],
      result: { id: r.output, count: r.count },
    }).id(`kubejs:stone_age/planks_saw/${name}`)
  })
  console.info(`[stone_age] planks recipes moved to axe/saw: ${found.length}`)

  // No Tree Punching removes the vanilla wooden tools, so recipes that ask for one could never be crafted (the cooking pot
  // among them). Listed by ID: a blanket replace would also turn Silent Gear's tool conversion and Aether's wooden-tool
  // repair into flint tool recipes. MineColonies huts are left to the colonies topic.
  const flint = {
    'minecraft:wooden_shovel': 'notreepunchingremastered:flint_shovel',
    'minecraft:wooden_axe': 'notreepunchingremastered:flint_axe',
    'minecraft:wooden_pickaxe': 'notreepunchingremastered:flint_pickaxe',
    'minecraft:wooden_hoe': 'notreepunchingremastered:flint_hoe',
    'minecraft:wooden_sword': 'notreepunchingremastered:flint_knife',
  }
  const needWoodenTools = ['farmersdelight:cooking_pot', 'irons_spellbooks:graybeard_staff', 'sophisticatedbackpacks:tool_swapper_upgrade']
  needWoodenTools.forEach(id => Object.keys(flint).forEach(wooden => event.replaceInput({ id: id }, wooden, flint[wooden])))
})
