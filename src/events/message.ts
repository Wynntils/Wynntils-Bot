import consola from "consola";
import { Message, MessageEmbed } from "discord.js";
import { Channel } from "../constants/Channel";
import { Emoji } from "../constants/Emoji";
import { StopIllegalModRepostsService } from "../services/StopIllegalModRepostsService";

const modRepostsService = new StopIllegalModRepostsService();

export const action = (message: Message) => {
    // Check for illegal mod sites
    modRepostsService.hasIllegalModRepostSite(message.content).then((site) => {
        if (site) {
            message.delete({ reason: 'Contains illegal mod respost site' }).catch(consola.error);
            const embed = new MessageEmbed()
                .setTitle(':warning: Illegal Mod Website Detected :warning:')
                .setColor(7531934)
                .setDescription(`A message by ${message.author.username} has been deleted as it has been found to link a malicious Minecraft mod repost site.`)
                .addField('Site Information', `Advertising: ${site.advertising}\n\nRedistribution: ${site.redistribution}\n\nMiscellaneous: ${site.miscellaneous}` + site.notes ? `\n\nNotes: ${site.notes}` : '')
                .setFooter('Find out more at https://stopmodreposts.org');
            message.channel.send({ embed });
        }
    });

    // Add arrows to suggestions
    if (message.channel.id === Channel.Suggestions) {
        message.react(Emoji.ARROW_UP).then(() => message.react(Emoji.ARROW_DOWN));
    }
};
