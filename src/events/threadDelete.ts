import { TextChannel, ThreadChannel } from "discord.js";
import { logError, styledEmbed } from "../utils/functions";

export const action = async (thread: ThreadChannel) => {
  try {
    const logChannel = thread.guild.channels.cache.find(
      (c) => c.name === "server-logs"
    ) as TextChannel;
    const embed = styledEmbed()
      .setTitle("Thread Notification")
      .setDescription("A thread has been closed")
      .addFields([
        {
          name: "Name",
          value: thread.name,
          inline: false,
        },
        {
          name: "Owner",
          value: `<@${thread.ownerId}>`,
          inline: true,
        },
        {
          name: "Closed at",
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true,
        },
      ]);

    if (logChannel) logChannel.send({ embeds: [embed.toJSON()] });
  } catch (err: any) {
    logError(err);
  }
};
