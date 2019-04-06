module.exports = (bot, r) => {
  bot.on('ready', () => {
    // console.log(bot)
    bot.info('Server(s): ' + bot.guilds.size)
    bot.info('User(s): ' + bot.users.size)
    bot.info('Ready');
  });
}
