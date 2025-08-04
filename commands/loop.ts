import { Message, MessageEmbed, PermissionsBitField } from "discord.js";
import { bot } from "../index";
import { canModifyQueue } from "../utils/queue";

export default {
  name: "loop",
  description: "Toggles loop for the current song",
  cooldown: 2,
  permissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],

  async execute(message: Message) {
    const queue = bot.queues.get(message.guild!.id);
    const member = message.guild!.members.cache.get(message.author.id);

    if (!queue) {
      return message.channel.send("❌ Nothing is playing currently.");
    }

    if (!canModifyQueue(member!)) {
      return message.channel.send("❌ You must be in the same voice channel as the bot.");
    }

    queue.loop = !queue.loop;

    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("BLACK")
          .setDescription(`🔁 Loop is now **${queue.loop ? "ON" : "OFF"}**.`)
          .setFooter({ text: "﹒𔘓﹒LOVERZ  CAFE﹒| ﹒Chill﹒Social﹒Gws﹒Events" })
      ]
    });
  }
};
