import minimist from "minimist";
import { HelpCommand } from "./HelpCommand.js";
import type { Bot } from "../Bot.js";
import { PromptCommand } from "./PromptCommand.js";
import type { MyAI } from "../../ai/MyAI.js";
import { QueryCommand } from "./QueryCommand.js";

export class CommandManager {
    helpCommand: HelpCommand;
    promptCommand: PromptCommand;
    queryCommand: QueryCommand;

    constructor(bot: Bot, ai: MyAI) {
        this.helpCommand = new HelpCommand(bot);
        this.promptCommand = new PromptCommand(bot, ai);
        this.queryCommand = new QueryCommand(bot);
    }

    execute(groupId: number, sender: number, raw: string) {
        const splited = raw.trim().split(" ");
        const argv = minimist(splited);
        console.log(argv);
        if (argv["h"] || argv["help"] || splited.length === 1)
            return this.helpCommand.execute(groupId, sender, argv, raw);
        if (argv["Q"] || argv["q"])
            return this.queryCommand.execute(groupId, sender, argv, raw);
        this.promptCommand.execute(groupId, sender, argv, raw);
    }
}
