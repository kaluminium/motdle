import {CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('test')
			.setDescription("mets ce que tu veux enculé")
		),
	async execute(interaction : CommandInteraction) {
		const test : string | undefined = interaction.options.get('test')?.value?.toString()
		if(!test) return await interaction.reply({content:'Pong!', ephemeral: true});
		return await interaction.reply(test)
	},
};