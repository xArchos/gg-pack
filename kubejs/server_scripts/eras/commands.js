// /ery: show and set team eras, and the leave-party choice (docs/plans/eras.md, section 2).
(() => {
  const Commands = Java.loadClass('net.minecraft.commands.Commands')
  const EntityArgument = Java.loadClass('net.minecraft.commands.arguments.EntityArgument')
  const StringArgumentType = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType')

  ServerEvents.commandRegistry(event => {
    // Read at call time: a startup-script reload replaces global.ggEras, and captured references would go stale.
    const api = () => global.ggEras

    const show = (source, player) => {
      const team = api().teamOf(player)
      const era = api().ERAS[api().eraOf(player)]
      // Admin commands also run from the console or RCON, which have no lang files: Polish fallback.
      source.sendSystemMessage(Text.translatableWithFallback('gg.era.cmd.info', '%s: %s (%s), drużyna %s',
        player.username, api().eraText(era), era.id, team ? team.getName().getString() : '?'))
      return 1
    }

    const set = (source, player, id) => {
      const era = api().eraById(id)
      const team = api().teamOf(player)
      if (!era || !team) {
        source.sendSystemMessage(Text.translatableWithFallback('gg.era.cmd.unknown', 'Nieznana era albo brak drużyny: %s', id).red())
        return 0
      }
      api().setTeamEra(team, era.n)
      source.sendSystemMessage(Text.translatableWithFallback('gg.era.cmd.set', '%s: ustawiono %s',
        team.getName().getString(), api().eraText(era)).green())
      return 1
    }

    const choose = (source, keepParty) => {
      const player = source.getPlayerOrException()
      if (!api().choose(player, keepParty)) {
        source.sendSystemMessage(Text.translatable('gg.era.cmd.no_choice').gray())
        return 0
      }
      source.sendSystemMessage(Text.translatable('gg.era.cmd.continue_in', api().eraText(api().ERAS[api().eraOf(player)])).green())
      return 1
    }

    event.register(Commands.literal('ery')
      .then(Commands.literal('pokaz')
        .executes(ctx => show(ctx.getSource(), ctx.getSource().getPlayerOrException()))
        .then(Commands.argument('gracz', EntityArgument.player())
          .requires(source => source.hasPermission(2))
          .executes(ctx => show(ctx.getSource(), EntityArgument.getPlayer(ctx, 'gracz')))))
      .then(Commands.literal('ustaw')
        .requires(source => source.hasPermission(2))
        .then(Commands.argument('gracz', EntityArgument.player())
          .then(Commands.argument('era', StringArgumentType.word())
            .suggests((ctx, builder) => {
              api().ERAS.forEach(e => builder.suggest(e.id))
              return builder.buildFuture()
            })
            .executes(ctx => set(ctx.getSource(), EntityArgument.getPlayer(ctx, 'gracz'), StringArgumentType.getString(ctx, 'era'))))))
      .then(Commands.literal('wybor')
        .then(Commands.literal('druzyna').executes(ctx => choose(ctx.getSource(), true)))
        .then(Commands.literal('wlasny').executes(ctx => choose(ctx.getSource(), false)))))
  })
})()
