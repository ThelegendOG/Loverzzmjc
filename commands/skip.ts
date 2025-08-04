import { Message, PermissionsBitField, MessageEmbed } from "discord.js";
import { bot } from "../index";
import { canModifyQueue } from "../utils/queue";

export default {
  name: "skip",
  description: "Skips the currently playing song",
  cooldown: 2,
  permissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],

  async execute(message: Message) {
    const queue = bot.queues.get(message.guild!.id);
    const member = message.guild!.members.cache.get(message.author.id);

    if (!queue) {
      return message.channel.send("❌ No song is currently playing.");
    }

    if (!canModifyQueue(member!)) {
      return message.channel.send("❌ You must be in the same voice channel as the bot.");
    }

    queue.player.stop(true);

    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("BLACK")
          .setDescription(`⏭️ Skipped the song.`)
          .setFooter({ text: "﹒𔘓﹒LOVERZ  CAFE﹒| ﹒Chill﹒Social﹒Gws﹒Events" })
      ]
    });
  }
};
