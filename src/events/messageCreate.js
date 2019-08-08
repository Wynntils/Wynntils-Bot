module.exports = (bot, r) => {
  bot.on('messageCreate', (msg) => {
    if (!bot.ready || !msg || !msg.author || msg.author.bot) return;
    if (msg.channel.guild.id !== bot.config.server) return;
    //End the meme
    if (msg.content.match(/^[\s*_]*creeper[\s*_]*$/i)) msg.delete().catch(O_o => { });
    if (bot.blacklist.test(msg.content.replace(/[ .]/g, ""))) {
      msg.delete().catch(O_o => { });
      var e = msg.channel.createEmbed()
                .title(":warning: Illegal Mod Website Detected :warning:")
                .color(7531934)
                .description(`A message by ${msg.author.username} has been deleted as it has been found to link an illegal Minecraft mod website. These sites are known to illegally redistrubute mods, improperly credit developers, have nonexistent mod versions, or include malware in their downloads.\n\nYou can read more about the StopModReposts movement here: [stopmodreposts.org](https://stopmodreposts.org/).`);
      msg.channel.createMessage( { embed: e.sendable });
    }
    if (!msg.content.startsWith(bot.config.prefix)) return;
    if (msg.channel.id === '424990456435310602' && msg.author.id !== '188557595382906880' && !msg.content.startsWith(`${bot.config.prefix}faq`)) return; // Don't talk in general >:(
    const command = bot.commands.filter((c) => c.info.uses.includes(msg.content.split(' ')[0].replace(bot.config.prefix, '').toLowerCase()));
    if (command.length < 1) return;
    if (!msg.channel.guild) return;
    try {
      if (msg.content.startsWith(`${bot.config.prefix}faq`)) msg.delete().catch(O_o => { });
      bot.sendChannelTyping(msg.channel.id);
      command[0].execute(bot, r, msg, msg.content.replace(bot.config.prefix, '').split(' ').slice(1));
    } catch (e) {
      msg.channel.createMessage(':x: │ An error occurred while running that command!');
      bot.error(e);
    }
  });
};
