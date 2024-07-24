import { Client, Events, Message } from "discord.js";
import {BotEvent} from "../types";
const emojis = require("../../emojis.json")

const event: BotEvent = {
    name: Events.MessageCreate,
    once: false,
    execute: (message : Message) => {
        if(message.author.bot) return;
        let test = emojis[message.cleanContent.toUpperCase()] ? emojis[message.cleanContent.toUpperCase()] : ""
        if(test === "") return
        message.channel.send("<:" + message.cleanContent.toUpperCase()+ "_grey:" + test.grey + "> <:" + message.cleanContent.toUpperCase() + "_yellow:" + test.yellow + "> <:" + message.cleanContent.toUpperCase() +  "_green:" + test.green + ">")
    }
}

export default event;