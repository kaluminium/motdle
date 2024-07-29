import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder , MessageComponentInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, ModalSubmitInteraction, InteractionResponse} from "discord.js";
import { SlashCommand } from "../../types";
import { WordService } from "../../services/wordService";
import { GameReturn, MotdleGame } from "../../core/motdleGame";
const emojis = require("../../data/emojis.json")

export const command : SlashCommand = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Find the word of the day !'),
    execute : async (interaction : CommandInteraction) => {
        const wordService : WordService = WordService.getInstance()
        let word : string = wordService.getWord().toUpperCase()
        let game : MotdleGame = new MotdleGame(word, interaction.user.id, interaction.guildId, 5)
        let responses : InteractionResponse[] = []

        const embedMessage : EmbedBuilder= getEmbed(word, game)

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

        const response = await interaction.reply({embeds : [embedMessage], components : [row], ephemeral : true})
        responses.push(response)

        let collector = response.createMessageComponentCollector({time: 600000});

        const myfilter = (i : ModalSubmitInteraction) => i.customId === 'motdleGame' && i.user.id === interaction.user.id;

        let activeSubmitToken : any = null;


        collector.on('collect', async (i) => {
            if (i.member?.user.id !== interaction.member?.user.id) return;
            if (i.customId !== "play") return;
            await i.showModal(modal);
            const currentSubmitToken = Symbol();
            activeSubmitToken = currentSubmitToken;

            const timeout = 300000;

            const modalSubmitPromise = i.awaitModalSubmit({ filter: myfilter, time: timeout })
                .then(submitted => {
                    if (activeSubmitToken !== currentSubmitToken) {
                        return null;
                    }
                    return submitted;
                })
                .catch(error => {return null;});

            const submitted = await modalSubmitPromise;

            if (!submitted) {
                return;
            }

            if (submitted.isModalSubmit()) {
                let inputWord = submitted.fields.getTextInputValue("wordInput").toUpperCase();
                let gameReturn : GameReturn = game.addWord(inputWord)
                if(gameReturn.code < 0){
                    i.channel?.send(gameReturn.message)
                    return
                }
                responses.push(await submitted.reply({embeds : [getEmbed(word, game)], components : [row], ephemeral : true}))
                if(gameReturn.code > 0){
                    i.channel?.send(gameReturn.message)
                    collector.stop()
                    playButton.setDisabled()
                    for(let rep of responses){
                        rep.edit({components : [row]})
                    }
                    return
                }
            }
        });


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

function getEmbed(word : string, game : MotdleGame) : EmbedBuilder{
    const embed = new EmbedBuilder()
        .setColor(0x0000ff)
        .setTitle('New Game !')
        .addFields(
            {name : 'Start : ', value : `<t:${Math.floor(game.getStartingTime() / 1000)}:R>`, inline: true},
            {name : 'Difficulty : ', value : `${word.length} letters`, inline : true},
            {name : 'Tries : ', value : `${game.getTries()}/${game.getMaxTries()}`, inline : true},
            {name : 'Letters : ', value : game.getUnusedLetters().join(", ")}
        )
        .setFooter({text : 'Motdle'})
        .setTimestamp()

        if(game.getHistoryLetters().length < 1) embed.setDescription("Here the word to find : \n" + ":grey_question:".repeat(word.length))
        else embed.setDescription("History : \n" + game.getHistoryLetters().join("\n"))
    return embed
}