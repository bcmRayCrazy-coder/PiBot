import type { ParsedArgs } from "minimist";
import { Command } from "./Command.js";
import { Structs } from "node-napcat-ts";

export class HelpCommand extends Command {
    execute(groupId: number, sender: number, argv: ParsedArgs,raw:string) {
        this.bot.messageSender.sendGroupMsg(groupId, [Structs.text("PiBot 1.0.0\nby bcmray")])
    }

}