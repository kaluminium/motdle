import { ActivityType, Client, Events, PresenceUpdateStatus } from "discord.js";
import { BotEvent, BotPresence } from "../types";

const presences: Array<BotPresence> = [
    { name: '%SERVERS% servers', type: ActivityType.Watching},
    { name: 'Motdle - /play', type: ActivityType.Playing}
];

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute: async (client: Client) => {
        console.log(`Connected as ${client.user?.tag} !`);

        let i: number = 0;
        let presence: BotPresence;
        setInterval(async () => {
            presence = presences[i];
            let presenceName : string = presence.name
                .replace("%SERVERS%", "" + client.guilds.cache.size);

            client.user?.setActivity(
                presenceName, {type : presence.type});

            i = (i + 1) % presences.length; 
        }, 20000);
    }
};

export default event;