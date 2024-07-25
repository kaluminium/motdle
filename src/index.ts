import { Client, GatewayIntentBits, Collection} from 'discord.js';
import dotenv from 'dotenv';
import {readdirSync} from "fs";
import {join} from "path";
import {SlashCommand} from "./types.d";
import { WordService } from './services/wordService';

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
client.autorisations = new Collection<string, string>()
const handlersDirs = join(__dirname, './handlers');

readdirSync(handlersDirs).forEach(file => {
  require(`${handlersDirs}/${file}`)(client);
})

let wordService : WordService = WordService.getInstance()

client.login(TOKEN).catch(console.error);