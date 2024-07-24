import { Client, CommandInteraction, Events, Interaction, Message } from "discord.js";
import {BotEvent} from "../types";
const emojis = require("../../emojis.json")

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction : Interaction) => {
        if (interaction.isChatInputCommand()){
            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) return;
            try{
                await command.execute(interaction);
            }catch (error){
                console.error(error);
            }
        }
    }
}

export default event;