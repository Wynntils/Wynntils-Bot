import consola from 'consola'
import requireAll from 'require-all'
import { Client, Intents } from 'discord.js'
import { faqService } from './services/FaqService'
import { configService } from './services/ConfigService'
import { logError } from './utils/functions'
import { GatewayServer, SlashCreator } from 'slash-create'
import path from 'path'
import { HelpCommand } from './classes/HelpCommand'

const client = new Client({
    presence: { activities: [{ name: 'Here to help!' }], status: 'online' },
    partials: ['MESSAGE', 'REACTION'],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS]
})

/* Register events */
const events = requireAll({
    dirname: path.join(__dirname, 'events')
})

Object.keys(events).forEach((eventName) => {
    const action = events[eventName].action
    consola.debug(`Registering event: ${eventName}`)
    client.on(eventName, action)
})

client.login(process.env.BOT_TOKEN).then(async () => {
    await faqService.init()
    await configService.init()

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => logError(error))
    process.on('uncaughtException', (error: Error, origin: string) => logError(error))

    const creator = new SlashCreator({
        applicationID: process.env.APPLICATION_ID ?? '',
        publicKey: process.env.PUBLIC_KEY ?? '',
        token: process.env.BOT_TOKEN ?? ''
    })

    const commands = requireAll({
        dirname: path.join(__dirname, 'commands')
    })

    creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))

    Object.keys(commands).forEach((command) => {
        const className = Object.keys(commands[command])[0]
        creator.registerCommand(commands[command][className])
    })
    creator.registerCommand(HelpCommand)
    creator.syncCommands()

    creator.on('debug', consola.debug)
    creator.on('warn', consola.warn)
    creator.on('error', logError)
    creator.on('synced', () => consola.success('Commands synced!'))
    creator.on('commandRegister', (command) => consola.info(`Registered command ${command.commandName}`))
    creator.on('commandError', (command, err) => logError(err))
}).catch(consola.error)

export { client }
