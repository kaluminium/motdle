import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';


dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Connected as ${client.user?.tag}`);
});

client.login(TOKEN).catch(console.error);