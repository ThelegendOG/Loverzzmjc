import { Client, GatewayIntentBits, EmbedBuilder, Message } from "discord.js";
import { Bot } from "./structs/Bot";

export const bot = new Bot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ]
  })
);

// Message Create Event
bot.on("messageCreate", async (message: Message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.toLowerCase();

  // HELP
  if (content === "help") {
    const embed = new EmbedBuilder()
      .setTitle("Loverz Cafe Help Menu")
      .setDescription("Here's the list of my available commands.")
      .setColor(0x000000)
      .setFooter({ text: "﹒𔘓﹒LOVERZ  CAFE﹒| ﹒Chill﹒Social﹒Gws﹒Events" })
      .setTimestamp()
      .addFields(
        { name: "**play <song name/link>**", value: "Plays music in your voice channel.", inline: false },
        { name: "**mhelp**", value: "Shows all music commands.", inline: false },
        { name: "**skip**", value: "Skips the current song.", inline: false },
        { name: "**stop**", value: "Stops the music and clears queue.", inline: false }
        // Add more fields here if needed
      );

    return message.channel.send({ embeds: [embed] });
  }

  // MUSIC HELP
  if (content === "mhelp") {
    const embed = new EmbedBuilder()
      .setTitle("🎵 Music Help Menu")
      .setDescription("Here's the list of all available music commands:")
      .setColor(0x000000)
      .setFooter({ text: "﹒𔘓﹒LOVERZ  CAFE﹒| ﹒Chill﹒Social﹒Gws﹒Events" })
      .setTimestamp()
      .addFields(
        { name: "**play <song name/link>**", value: "Plays music.", inline: true },
        { name: "**queue**", value: "Shows music queue.", inline: true },
        { name: "**skip**", value: "Skips current song.", inline: true },
        { name: "**stop**", value: "Stops music.", inline: true }
      );

    return message.channel.send({ embeds: [embed] });
  }
});
