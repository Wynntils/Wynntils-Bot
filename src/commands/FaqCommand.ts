import { MessageEmbed } from 'discord.js';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { client } from '..';
import { faqService } from '../services/FaqService';

export class FaqCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'faq',
            guildID: '394189072635133952',
            description: 'Provides information on frequently asked question',
            options: [
                {
                    name: 'value',
                    description: 'Name of FAQ entry',
                    type: CommandOptionType.STRING,
                    required: true,
                    choices: Array.from(faqService.cache.keys()).map(k => {
                        return { name: k, value: k }; 
                    })
                }
            ] 
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const faq = (await faqService.get()).get(ctx.options.value.toString());
        
        if (faq) {
            const embed = new MessageEmbed();
            embed.setColor(7531934);
            embed.setAuthor('Wynntils FAQ', client.user?.avatarURL() ?? client.user?.defaultAvatarURL);
            embed.addField(faq.title, faq.value);
            embed.setFooter(`By: ${ctx.member.user.username}#${ctx.member.user.discriminator} - Please read #faq`);
            return { embeds: [embed] };
        }
        
        return { content: `Unable to find entry for ${ctx.options.value.toString()}`, ephemeral: true };
    }
}
