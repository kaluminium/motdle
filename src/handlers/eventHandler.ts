import {Client} from "discord.js";
import {join} from "path";
import {readdirSync} from "fs";
import {BotEvent} from "../types.d";

module.exports = (client: Client) => {
    let eventsDir = join(__dirname, '../events');

    readdirSync(eventsDir).forEach(file => {
        if(!file.endsWith('.js')) return;
        let event: BotEvent = require(`${eventsDir}/${file}`).default;

        event.once
        ? client.once(event.name, (...args) => event.execute(...args, client))
        : client.on(event.name, (...args) => event.execute(...args, client));

        console.log(`Event ${event.name} has been loaded !`);
    })
}