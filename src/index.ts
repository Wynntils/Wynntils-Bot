import consola from 'consola';
import requireAll from 'require-all';
import { Client } from 'discord.js';
import { SlashCreator, GatewayServer } from 'slash-create';
import { faqService } from './services/FaqService';
import { configService } from './services/ConfigService';

const client = new Client({
    presence: { activity: { name: 'Here to help!' }, status: 'online' },
    partials: ['MESSAGE', 'REACTION'],
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS']
    } 
});
const creator = new SlashCreator({
    applicationID: process.env.APPLICATION_ID ?? '',
    publicKey: process.env.PUBLIC_KEY ?? '',
    token: process.env.BOT_TOKEN ?? ''
});

async function initialize() {
    await faqService.init();
    await configService.init();

    //@ts-expect-error INTERACTION_CREATE is not yet an event for this version of discord.js
    creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))
        .registerCommandsIn(__dirname + '/commands')
        .syncCommands();

    creator.on('debug', consola.debug);
    creator.on('warn', consola.warn);
    creator.on('error', consola.error);
    creator.on('synced', () => consola.success('Commands synced!'));
    creator.on('commandRegister', (command) => consola.info(`Registered command ${command.commandName}`));
    creator.on('commandError', (command, err) => consola.error(`Command: ${command.commandName}`, err));

    /* Register events */
    const events = requireAll({
        dirname: __dirname + '/events'
    });

    Object.keys(events).forEach((eventName) => {
        const action = events[eventName].action;
        consola.info(`Registering event: ${eventName}`);
        client.on(eventName, action);
    });

    client.login(process.env.BOT_TOKEN);
}

initialize();

export { client, creator };
