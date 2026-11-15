// /kolonia: colony era diagnostics for admins; works when the colony owner is offline.
(() => {
  const Commands = Java.loadClass('net.minecraft.commands.Commands')
  const IntegerArgumentType = Java.loadClass('com.mojang.brigadier.arguments.IntegerArgumentType')
  const StringArgumentType = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType')
  const FTBTeamsAPI = Java.loadClass('dev.ftb.mods.ftbteams.api.FTBTeamsAPI')
  const ColonyEras = Java.loadClass('gearsandgrimoires.fixes.colonies.ColonyEras')

  const ownerTeam = colonyId => {
    const owner = ColonyEras.ownerOf(colonyId)
    return owner ? FTBTeamsAPI.api().getManager().getTeamForPlayerID(owner).orElse(null) : null
  }

  const info = (source, colonyId) => {
    const api = global.ggEras
    const huts = global.ggColonyHuts
    if (!ColonyEras.ownerOf(colonyId)) {
      source.sendSystemMessage(Text.of(`Nie ma kolonii ${colonyId}`).red())
      return 0
    }
    const team = ownerTeam(colonyId)
    const era = api.ERAS[api.teamEra(team)]
    const done = api.ERAS.filter(e => e.n > 0 && ColonyEras.hasResearch(colonyId, `minecolonies:gg_eras/era_${e.id}`)).map(e => e.id)
    source.sendSystemMessage(Text.of(`Kolonia ${colonyId}: drużyna ${team ? team.getName().getString() : '?'}, ${era.name}`).gold())
    source.sendSystemMessage(Text.of(`Badania er: ${done.length ? done.join(', ') : 'brak'}`))
    const levels = huts.HUTS.map(h => {
      const strength = ColonyEras.effectStrength(colonyId, h.id.replace(':', ':effects/'))
      return `${h.id.substring(h.id.indexOf('blockhut') + 8)} ${strength}`
    })
    source.sendSystemMessage(Text.of(`Limity poziomów: ${levels.join(', ')}`).gray())
    return 1
  }

  const setEra = (source, colonyId, eraId) => {
    const api = global.ggEras
    const era = api.eraById(eraId)
    const team = ownerTeam(colonyId)
    if (!era || !team) {
      source.sendSystemMessage(Text.of(`Nieznana era albo kolonia bez drużyny: ${eraId}`).red())
      return 0
    }
    api.setTeamEra(team, era.n)
    ColonyEras.refreshAll()
    return info(source, colonyId)
  }

  ServerEvents.commandRegistry(event => {
    event.register(Commands.literal('kolonia')
      .requires(source => source.hasPermission(2))
      .then(Commands.literal('ery')
        .then(Commands.argument('kolonia', IntegerArgumentType.integer(1))
          .executes(ctx => info(ctx.getSource(), IntegerArgumentType.getInteger(ctx, 'kolonia')))
          .then(Commands.argument('era', StringArgumentType.word())
            .suggests((ctx, builder) => {
              global.ggEras.ERAS.forEach(e => builder.suggest(e.id))
              return builder.buildFuture()
            })
            .executes(ctx => setEra(ctx.getSource(), IntegerArgumentType.getInteger(ctx, 'kolonia'), StringArgumentType.getString(ctx, 'era')))))))
  })
})()
