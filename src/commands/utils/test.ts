import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder , MessageComponentInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, ModalSubmitInteraction, InteractionResponse} from "discord.js";
import { SlashCommand } from "../../types.d";
import { WordService } from "../../services/wordService";
import { MotdleGame } from "../../core/motdleGame";
const emojis = require("../../data/emojis.json")

export const command : SlashCommand = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Vraiment pour faire des tests quoi'),
    authorisation : "beta",
    execute : async (interaction : CommandInteraction) => {
        const wordService : WordService = WordService.getInstance()
        let word : string = wordService.getWord().toUpperCase()
        let game : MotdleGame = new MotdleGame(word, interaction.user.id, interaction.guildId, 5)

        const embedMessage : EmbedBuilder= new EmbedBuilder()
        .setColor(0x0000ff)
        .setTitle('New Game !')
        .setDescription("Here the word to find : \n"+
            ":grey_question:".repeat(word.length))
        .addFields(
            {name : 'Difficulty : ', value : `${word.length} letters`, inline : true},
            {name : 'Tries : ', value : `${game.getTries()}/${game.getMaxTries()}`, inline : true},
            {name : 'Letters : ', value : game.getUnusedLetters().join(", ")}
        )
        .setFooter({text : 'Motdle'})
        .setTimestamp()

        const playButton : ButtonBuilder = new ButtonBuilder()
        .setCustomId('play')
        .setLabel('Play')
        .setStyle(ButtonStyle.Primary)

        const row : ActionRowBuilder<any> = new ActionRowBuilder<any>()
        .addComponents(playButton)

        const modal : ModalBuilder = new ModalBuilder()
        .setCustomId("motdleGame")
        .setTitle("Find the word")

        const wordInput : TextInputBuilder = new TextInputBuilder()
        .setCustomId("wordInput")
        .setStyle(TextInputStyle.Short)
        .setLabel("Word : ")
        .setMaxLength(word.length)
        .setMinLength(word.length)

        const wordInputActionRow : ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(wordInput)

        modal.addComponents(wordInputActionRow)

        const response = await interaction.reply({embeds : [embedMessage], components : [row]})

        let collector = response.createMessageComponentCollector({time: 600000});

        const myfilter = (i : ModalSubmitInteraction) => i.customId === 'motdleGame' && i.user.id === interaction.user.id;

        collector.on('collect', async (i) => {
            if(i.member?.user.id !== interaction.member?.user.id) return;
            await i.showModal(modal)
            
            const submitted = await interaction.awaitModalSubmit({time: 300000, filter : myfilter}).catch(() => {return null});
            if(submitted){
                let inputWord = submitted.fields.getTextInputValue("wordInput").toUpperCase()
                await submitted.reply("-------")
                game.addToHistory(inputWord)
                for(let word of game.getHistoryLetters()) await i.channel?.send(word)
                if(inputWord == word){
                    collector.stop()
                }            
            }
        })

        collector.on('end', async (i: MessageComponentInteraction, reason) => {
            if(reason === 'time'){
                await response.delete();
                collector.stop();
            }else{
                response.edit({content : "en vrai t'es un peu nul mdr"})
            }
        })
    }
}