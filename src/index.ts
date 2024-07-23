import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';
const emojis = require("../emojis.json")

dotenv.config();
const TOKEN : string | undefined = process.env.DISCORD_TOKEN;
const client : Client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Connected as ${client.user?.tag}`);
});

client.on("messageCreate", (message : Message) => {
  if(message.author.bot) return;
  let test = emojis[message.cleanContent.toUpperCase()] ? emojis[message.cleanContent.toUpperCase()] : ""
  if(test === "") return
  message.channel.send("<:" + message.cleanContent.toUpperCase()+ "_grey:" + test.grey + "> <:" + message.cleanContent.toUpperCase() + "_yellow:" + test.yellow + "> <:" + message.cleanContent.toUpperCase() +  "_green:" + test.green + ">")
})

client.login(TOKEN).catch(console.error);