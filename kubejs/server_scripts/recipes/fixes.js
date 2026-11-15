// Tag entries shipped by mods that break loading or unification. Each entry lists the mod version it was checked against.
ServerEvents.tags('item', event => {
  // discerning_the_eldritch 1.4.5 lists an item it no longer registers; vanilla then rejects the whole tag
  // and every tag that includes it (enchantable/*, c:tools, c:enchantables).
  event.remove('minecraft:swords', 'discerning_the_eldritch:echo_greatsword')

  // monsterspellbooks 0.0.15 and goety 3.2.2 put their own materials into vanilla material tags,
  // so AlmostUnified rewrites their recipes to iron, lapis and emerald.
  event.remove('c:nuggets/iron', 'monsterspellbooks:scorched_metal_nugget')
  event.remove('c:raw_materials/iron', 'monsterspellbooks:raw_scorched_metal')
  event.remove('c:gems/lapis', 'monsterspellbooks:nether_pyrite')
  event.remove('c:gems/emerald', 'goety:magic_emerald')
  event.remove('c:storage_blocks/emerald', 'goety:awakened_emerald_block')
})
