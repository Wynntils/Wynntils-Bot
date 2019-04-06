const fs          = require('fs');
const path        = require('path');
const config      = require('./config.json');
const logger      = require('./util/logger.js');
const Collection  = require('./structure/Collection.js');
const Command     = require('./structure/Command.js');
const Eris        = require('eris');
const rethink     = require('rethinkdbdash');

let r = rethink({
  db: 'wynntils',
  password: config.password
});

const bot = new Eris(config.token);

bot.info         = logger.info;
bot.warn         = logger.warn;
bot.error        = logger.error;
bot.config       = config;
bot.commands     = new Collection();
bot.startupTime  = Date.now();

fs.readdir(path.join(__dirname, 'commands'), (error, commands) => {
  if (error) throw error;
  fs.readdir(path.join(__dirname, 'events'), (error, events) => {
    if (error) throw error;
    for (let i = 0; i < commands.length; i++) {
      const command = require(path.join(__dirname, 'commands', commands[i]));
      bot.commands.set(command.info.name.toLowerCase(), new Command(command));
      if (i === commands.length - 1) {
        bot.info('Loaded ' + bot.commands.size + ' commands!');
        for (let i = 0; i < events.length; i++) {
          require('./events/' + events[i])(bot, r);
          if (i === events.length - 1) {
            bot.info('Loaded ' + events.length + ' events!');
            bot.connect();
          }
        }
      }
    }
  });
});