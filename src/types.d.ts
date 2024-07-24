import {ActivityType, Collection, CommandInteraction, PresenceStatusData, SlashCommandBuilder} from "discord.js";
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
    name: string;
    category: string,
    description: string,
    usage : string,
    options?: Array<{type: string, name: string, description: string, required: boolean, autocomplete: boolean}>,
    execute: (interaction: CommandInteraction) => Promise<any>;
    autocomplete?: (interaction: any) => Promise<any>;
}

export interface BotPresence {
    name : string,
    type : ActivityType
}

export {};