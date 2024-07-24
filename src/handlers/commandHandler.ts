import { SlashCommandBuilder, REST, Routes, Client, Collection } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import path from 'path';
import fs from 'fs';


module.exports = async (client: Client) => {
    const commands : Collection<string, Command> = new Collection()
    await loadCommands(client)
    await registerCommands()

    async function loadCommands(client : Client) {
        const foldersPath = path.join(__dirname, '../commands');
        const commandFolders = fs.readdirSync(foldersPath);
    
        for (const folder of commandFolders) {
          const commandsPath = path.join(foldersPath, folder);
          const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            let command = require(filePath).command;
            if ('data' in command && 'execute' in command) {
              commands.set(command.data.name, command);
              client.slashCommands.set(command.data.name, command)
              if('authorisation' in command){
                client.autorisations.set(command.data.name, command.authorisation)
              }
            console.log(`Interaction ${command.data.name} has been loaded !`)
            } else {
              console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
          }
        }
    }

    async function registerCommands() {
        const token = process.env.DISCORD_TOKEN!;
        const clientId = process.env.CLIENT_ID!;
        const guildId = process.env.GUILD_ID!;
    
        const rest = new REST({ version: '10' }).setToken(token);
    
        try {
            console.log('Started refreshing application (/) commands.');
    
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: Array.from(commands.values()).map(cmd => cmd.data.toJSON()),
            });
    
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }
}

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
