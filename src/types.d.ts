import {ActivityType, Collection, CommandInteraction, PresenceStatusData, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder} from "discord.js";
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_ID: string;
            TOKEN: string
        }
    }
}

declare module 'discord.js' {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>,
        autorisations : Collection<string, string>
    }
}

export interface BotEvent {
    name: string;
    once?: boolean | false,
    execute: (...args) => void;
}

export interface SlashCommand {
    data : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute : (interaction: CommandInteraction) => Promise<any>;
    authorisation? : string;
}

export interface BotPresence {
    name : string,
    type : ActivityType
}

export {};