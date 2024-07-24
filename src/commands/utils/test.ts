import {CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Vraiment pour faire des tests quoi'),
    authorisation : "developper",
	async execute(interaction : CommandInteraction) {
        interaction.reply("toi t'es un développeur petit cochon")
	},
};