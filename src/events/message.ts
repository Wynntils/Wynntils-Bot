import consola from 'consola';
import { Message, MessageEmbed } from 'discord.js';
import { Channel } from '../constants/Channel';
import { Emoji } from '../constants/Emoji';
import { stopIllegalModRepostsService } from '../services/StopIllegalModRepostsService';

export const action = (message: Message): void => {
    // Check for illegal mod sites
    stopIllegalModRepostsService.hasIllegalModRepostSite(message.content).then((site) => {
        if (site) {
            message.delete({ reason: 'Contains illegal mod respost site' }).catch(consola.error);
            const embed = new MessageEmbed()
                .setTitle(':warning: Illegal Mod Website Detected :warning:')
                .setColor(7531934)
                .setDescription(`A message by ${message.author.username} has been deleted as it has been found to link a malicious Minecraft mod repost site.`)
                .addField('Categorized Offense Severities', `**Advertising**: ${site.advertising}\n**Redistribution**: ${site.redistribution}\n**Miscellaneous**: ${site.miscellaneous}` + (site.notes ? `\n**Notes**: ${site.notes}` : ''))
                .setFooter('Find out more at https://stopmodreposts.org');
            message.channel.send({ embed });
        }
    });

    // Add arrows to suggestions
    if (message.channel.id === Channel.Suggestions) {
        message.react(Emoji.ARROW_UP).then(() => message.react(Emoji.ARROW_DOWN));
    }
};
