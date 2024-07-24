import { Client, GatewayIntentBits, Message, Collection} from 'discord.js';
import dotenv from 'dotenv';
import {readdirSync} from "fs";
import {join} from "path";
import {SlashCommand} from "./types.d";

dotenv.config();
const TOKEN : string | undefined = process.env.DISCORD_TOKEN;
const client : Client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
  ],
});

client.slashCommands = new Collection<string, SlashCommand>();

const handlersDirs = join(__dirname, './handlers');

readdirSync(handlersDirs).forEach(file => {
  require(`${handlersDirs}/${file}`)(client);
})

client.login(TOKEN).catch(console.error);