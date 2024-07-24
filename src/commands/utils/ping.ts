import {CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.d";

export const command : SlashCommand = {
	data: new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!')
	.addStringOption(option =>
		option.setName('test')
		.setDescription("mets ce que tu veux enculé")
	),
	execute : async (interaction : CommandInteraction) => {
		const test : string | undefined = interaction.options.get('test')?.value?.toString()
		if(!test) return await interaction.reply({content:'Pong!', ephemeral: true});
		return await interaction.reply(test)
	},
};