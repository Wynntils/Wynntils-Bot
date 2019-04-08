module.exports = (bot, r) => {
  bot.on('messageCreate', (msg) => {
    if (!bot.ready || !msg || !msg.author || msg.author.bot) return;
    if (!msg.content.startsWith(bot.config.prefix)) return;
    if (msg.channel.guild.id !== bot.config.server) return;
    if (msg.channel.id === '424990456435310602' && msg.author.id !== '188557595382906880' && !msg.content.startsWith(`${bot.config.prefix}faq`)) return; // Don't talk in general >:(
    const command = bot.commands.filter((c) => c.info.uses.includes(msg.content.split(' ')[0].replace(bot.config.prefix, '').toLowerCase()));
    if (command.length < 1) return;
    if (!msg.channel.guild) return;
    try {
      msg.delete().catch(O_o => { });
      bot.sendChannelTyping(msg.channel.id);
      command[0].execute(bot, r, msg, msg.content.replace(bot.config.prefix, '').split(' ').slice(1));
    } catch (e) {
      msg.channel.createMessage(':x: │ An error occurred while running that command!');
      bot.error(e);
    }
  });
};