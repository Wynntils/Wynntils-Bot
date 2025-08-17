import consola from 'consola'
import requireAll from 'require-all'
import { Client, Partials, GatewayIntentBits, REST, Routes, Collection, Interaction } from 'discord.js'
import { faqService } from './services/FaqService'
import { logError } from './utils/functions'
import path from 'path'
import { HelpCommand } from './classes/HelpCommand'
import { guildColorService } from './services/GuildColorService'

const client = new Client({
    presence: { activities: [{ name: 'Here to help!' }], status: 'online' },
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
});

// Command collection
const commands = new Collection<string, any>();


// Register events
const events = requireAll({
    dirname: path.join(__dirname, 'events')
});
Object.keys(events).forEach((eventName) => {
    const action = events[eventName].action;
    consola.debug(`Registering event: ${eventName}`);
    client.on(eventName, action);
});


client.login(process.env.BOT_TOKEN).then(async () => {
    await faqService.init();
    await guildColorService.init();

    process.on('unhandledRejection', (error: Error) => logError(error));
    process.on('uncaughtException', (error: Error) => logError(error));

    const commandModules = requireAll({
        dirname: path.join(__dirname, 'commands')
    });


    const commandData = [];
    Object.keys(commandModules).forEach((key) => {
        const CommandClass = commandModules[key][Object.keys(commandModules[key])[0]];
        if (!CommandClass) return;
    
        if (CommandClass.name === 'FaqCommand') {
            const faqChoices = Array.from(faqService.cache.keys()).map(k => ({ name: k, value: k }));
            const instance = new CommandClass(client, faqChoices);
            commands.set(instance.data.name, instance);
            commandData.push(instance.data.toJSON());
        } else {
            const instance = new CommandClass(client);
            commands.set(instance.data.name, instance);
            commandData.push(instance.data.toJSON());
        }
    });

    if (HelpCommand) {
        const helpInstance = new HelpCommand(client, commands);
        commands.set(helpInstance.data.name, helpInstance);
        commandData.push(helpInstance.data.toJSON());
    }

    //-- Register slash commands with Discord
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN ?? '');
    try {
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.APPLICATION_ID ?? '', process.env.GUILD_ID),
                { body: commandData }
            );
            consola.success('Registered guild slash commands!');
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.APPLICATION_ID ?? ''),
                { body: commandData }
            );
            consola.success('Registered global slash commands!');
        }
    } catch (err) {
        consola.error('Failed to register slash commands:', err);
    }
}).catch(consola.error);

//-- Handle slash command interactions
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);

    consola.debug(`Received interaction for command: ${interaction.commandName}`);
    if (!command) {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Command not found.', flags: ['Ephemeral'] });
        }
        return;
    }

    let responded = false;
    try {
        if (command.hasPermission && !command.hasPermission(interaction)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', flags: ['Ephemeral'] });
            responded = true;
            return;
        }
        await command.execute(interaction);
        responded = true;
    } catch (err) {
        consola.error(err);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error executing this command.', flags: ['Ephemeral'] });
        } else {
            await interaction.reply({ content: 'There was an error executing this command.', flags: ['Ephemeral'] });
        }
        responded = true;
    }
    // Fallback: ensure every interaction gets a response
    setTimeout(async () => {
        if (!interaction.replied && !interaction.deferred && !responded) {
            try {
                await interaction.reply({ content: 'No response was sent for this command.', flags: ['Ephemeral'] });
            } catch {}
        }
    }, 2500);
});

export { client }
