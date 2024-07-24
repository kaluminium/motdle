import {CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.d";

export const command : SlashCommand = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Vraiment pour faire des tests quoi'),
    authorisation : "developper",
    execute : async (interaction : CommandInteraction) => {
        interaction.reply("toi t'es un développeur petit cochon")
        return
    }
}