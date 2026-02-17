import type { ParsedArgs } from "minimist";
import { Command } from "./Command.js";
import { Structs } from "node-napcat-ts";

export class HelpCommand extends Command {
    execute(groupId: number, sender: number, argv: ParsedArgs, raw: string) {
        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.text(
                "PiBot 1.0.0\nby bcmray\n命令用法:\n" +
                    "api <prompt>       -- 使用提示词查询API\n" +
                    "api -Q <query>     -- 完全匹配API\n" +
                    // "api -q <query>     -- 模糊搜索API\n" +
                    "api -h, --help     -- 帮助信息\n",
            ),
        ]);
    }
}
