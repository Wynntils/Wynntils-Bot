import { Command, CommandContext, MessageOptions, SlashCommandOptions, SlashCreator } from 'slash-create'
import { Client, TextChannel } from 'discord.js'
import { client } from '..'
import consola from 'consola'

interface WynntilsSlashCommandOptions extends SlashCommandOptions {
    helpText?: string;
    roles?: string[];
}

export default class WynntilsBaseCommand extends Command {
    readonly helpText: string
    readonly roles: string[]

    private readonly _client: Client
    protected opts: any
    protected channel: TextChannel | undefined

    public get client(): Client {
        return this._client
    }

    readonly log: (...args: any[]) => void

    constructor(creator: SlashCreator, opts: WynntilsSlashCommandOptions) {
        if (!opts.guildIDs) opts.guildIDs = client.guilds.cache.map(g => g.id)
        super(creator, opts)

        this.helpText = opts.helpText ?? 'No help text available'
        this.roles = opts.roles ?? []

        this._client = client
        this.log = consola.log
    }

    async run(ctx: CommandContext): Promise<MessageOptions | void> {
        // context.subcommands is sometimes empty even if subcommand used
        // use first option instead
        const key = Object.keys(ctx?.options)?.[0] ?? 'default'

        // Setup some helpers
        this.opts = ctx.options[key]
        if (ctx.guildID !== undefined)
            this.channel = <TextChannel>(await this.client.guilds.fetch(ctx.guildID)).channels.cache.get(ctx.channelID)
        if (typeof this[key as keyof this] === 'function') { // @ts-ignore
            return this[key](ctx)
        }

        if (typeof this['default' as keyof this] === 'function') {
            this.opts = ctx.options
            // @ts-ignore
            return this['default'](ctx)
        }

        return { content: 'Command not found', ephemeral: true }
    }

    hasPermission(ctx: CommandContext): boolean | string {
        if (ctx.guildID === '541709702136856613' || ctx.guildID === '942560349817831435') return true
        // Check if the user who ran the command has any roles that the command allows
        if (this.roles.length > 0 && ctx.member && ctx.guildID !== undefined) {
            for (const roleID of ctx.member.roles) {
                if (
                    this.roles.includes(roleID)
                    || this.roles.includes(this.client.guilds.cache.get(ctx.guildID)?.roles.cache.get(roleID)?.name ?? 'ROLENOTFOUND')
                ) return true
            }

            if (!this.requiredPermissions)
                return false
        }

        return super.hasPermission(ctx)
    }

}
