import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { MessageEmbed, PermissionsBitField, TextChannel, Message } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";

export default {
  name: "play",
  description: "Plays a song from YouTube or Spotify",
  cooldown: 3,
  permissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],

  async execute(message: Message, args: string[]) {
    const argSongName = args.join(" ");
    if (!argSongName) return message.channel.send("❌ Please provide a song name or URL.");

    const { channel } = message.member!.voice;
    if (!channel) return message.channel.send("❌ You need to be in a voice channel to play music.");

    const queue = bot.queues.get(message.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId) {
      return message.channel.send(`❌ You must be in the same voice channel as **${bot.client.user!.username}**.`);
    }

    const url = argSongName;

    // Playlist check
    if (playlistPattern.test(url)) {
      return bot.messageCommandsMap.get("playlist")!.execute(message, ["song"]);
    }

    let song;
    try {
      song = await Song.from(url, url);
    } catch (error: any) {
      console.error(error);

      if (error.name === "NoResults") {
        return message.channel.send(`❌ No results found for: ${url}`);
      }
      if (error.name === "InvalidURL") {
        return message.channel.send(`❌ Invalid URL: ${url}`);
      }

      return message.channel.send("❌ Something went wrong while trying to play the song.");
    }

    // Add song to queue if already playing
    if (queue) {
      queue.enqueue(song);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("BLACK")
            .setDescription(`✅ Added **${song.title}** to the queue.`)
            .setFooter({ text: "﹒𔘓﹒LOVERZ  CAFE﹒| ﹒Chill﹒Social﹒Gws﹒Events" })
        ]
      });
    }

    // New queue
    const newQueue = new MusicQueue({
      message,
      textChannel: message.channel as TextChannel,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
    });

    bot.queues.set(message.guild!.id, newQueue);

    newQueue.enqueue(song);
  }
};
