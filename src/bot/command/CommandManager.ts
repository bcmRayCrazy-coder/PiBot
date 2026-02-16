import minimist from "minimist";
import { HelpCommand } from "./HelpCommand.js";
import type { Bot } from "../Bot.js";
import { PromptCommand } from "./PromptCommand.js";
import type { MyAI } from "../../ai/MyAI.js";

export class CommandManager {
    helpCommand: HelpCommand;
    promptCommand: PromptCommand;

    constructor(bot: Bot, ai: MyAI) {
        this.helpCommand = new HelpCommand(bot);
        this.promptCommand = new PromptCommand(bot, ai);
    }

    execute(groupId: number, sender: number, raw: string) {
        const splited = raw.split(" ");
        const argv = minimist(splited);
        if (argv["h"] || argv["help"] || splited.length === 1)
            return this.helpCommand.execute(groupId, sender, argv, raw);
        this.promptCommand.execute(groupId, sender, argv, raw);
    }
}
