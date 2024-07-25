import {CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types.d";

export const command : SlashCommand = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Vraiment pour faire des tests quoi'),
    authorisation : "developper",
    execute : async (interaction : CommandInteraction) => {
        let word = "salut"

        const embedMessage : EmbedBuilder= new EmbedBuilder()
        .setColor(0x0000ff)
        .setTitle('New Game !')
        .setDescription("Here the word to find : \n"+
            ":black_large_square: :black_large_square: :black_large_square: :black_large_square: :black_large_square:")
        .addFields(
            {name : 'Difficulty : ', value : '5 letters', inline : true},
            {name : 'Tries : ', value : '0/6', inline : true},
            {name : 'Letters : ', value : 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', inline : true}
        )
        .setFooter({text : 'Motdle'})
        .setTimestamp()

        interaction.reply({embeds : [embedMessage]})
    }
}