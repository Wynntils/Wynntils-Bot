import consola from "consola";
import requireAll from 'require-all';
import { Client } from "discord.js";
import { Creator, GatewayServer } from 'slash-create';

const client = new Client();
const creator = new Creator({
    applicationID: process.env.APPLICATION_ID ?? '',
    publicKey: process.env.PUBLIC_KEY ?? '',
    token: process.env.BOT_TOKEN ?? ''
})

//@ts-ignore
creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))
    .registerCommandsIn(__dirname + '/commands')
    .syncCommands();

creator.on('debug', consola.debug);
creator.on('warn', consola.warn);
creator.on('error', consola.error);
creator.on('synced', () => consola.success('Commands synced!'));
creator.on('commandRegister', (command) => consola.info(`Registered command ${command.commandName}`));

/* Register events */
const events = requireAll({
    dirname: __dirname + '/events'
});

Object.keys(events).forEach((eventName) => {
    const action = events[eventName].action as (...args: any[]) => void;
    consola.info(`Registering event: ${eventName}`)
    client.on(eventName, action);
});

client.login(process.env.BOT_TOKEN);

export { client };
