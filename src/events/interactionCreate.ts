import { Client, CommandInteraction, Events, Interaction, Message } from "discord.js";
import {BotEvent} from "../types";
const config = require("../config.json")

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction : Interaction) => {
        if (interaction.isChatInputCommand()){
            const command = interaction.client.slashCommands.get(interaction.commandName);
            const authorisation = interaction.client.autorisations.get(interaction.commandName);
            if (authorisation == "developper"){
                if(!verifyDevelopper(interaction)) return interaction.reply("toi tu essaies de tricher");
            }
            if (authorisation == "beta"){
                if(!verifyDevelopper(interaction) && !verifyBeta(interaction)) return interaction.reply("toi tu essaies de tricher");
            }
            if (!command) return;
            try{
                await command.execute(interaction);
            }catch (error){
                console.error(error);
            }
        }
    }
}

function verifyDevelopper(interaction : Interaction){
    for(let id of config.developpers){
        if(interaction.member?.user.id == id) return true
    }
    return false
}

function verifyBeta(interaction : Interaction){
    for(let id of config.beta){
        if(interaction.member?.user.id == id) return true
    }
    return false
}

export default event;