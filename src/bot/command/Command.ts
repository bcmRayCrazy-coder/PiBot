import type { ParsedArgs } from "minimist";
import type { Bot } from "../Bot.js";

export class Command {
    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot;
    }
    execute(groupId: number, sender: number, argv: ParsedArgs,raw:string) { }
}