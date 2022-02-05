import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { styledEmbed } from '../utils/functions'

export class HelpCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'help',
            description: 'Shows the help menu',
            helpText: 'Shows the help menu',
            options: [
                {
                    name: 'command',
                    type: CommandOptionType.STRING,
                    description: 'What command to see the help information for',
                    choices: creator.commands.map((cmd) => ({
                        name: cmd.commandName,
                        value: cmd.commandName
                    }))
                }
            ],
            deferEphemeral: true
        })
        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        if (typeof ctx.options.command === 'undefined') {
            return {
                embeds: [
                    styledEmbed()
                        .addField('Commands:', this.creator.commands.filter(cmd => cmd.hasPermission(ctx) === true).map((cmd) => {
                            return `**${cmd.commandName}** - ${cmd.description}`
                        }).join('\n'))
                        .setTitle('Wynntils Help Commands').toJSON()
                ],
                ephemeral: true
            }
        }

        const search: string = <string>ctx.options.command
        const command = this.creator.commands.find(v => v.commandName === search) as WynntilsBaseCommand

        if (command.hasPermission(ctx) !== true) return { content: 'You do not have permission to use this command', ephemeral: true }

        const embed = styledEmbed().setTitle('Help: ' + search).setDescription(command.helpText)
            .setTitle('Wynntils Help Commands')

        if (typeof command.options !== 'undefined') {
            embed.addField('Usages:', command.options.map((cmd) => {
                switch (cmd.type) {
                    case CommandOptionType.SUB_COMMAND:
                        return `**${search} ${cmd.name} ` + cmd.options?.map((opt) => {
                            return `<${opt.required === true ? '' : '?'}${opt.name}>`
                        } ) + `** - ${cmd.description}`
                    case CommandOptionType.STRING:
                        return `**${search} <${cmd.name}>** - ${cmd.description}`
                    default:
                        return 'None'
                }
            }).join('\n'))
        }

        return {
            embeds: [embed.toJSON()],
            ephemeral: true
        }

    }
}
