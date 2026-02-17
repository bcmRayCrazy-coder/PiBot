import type { ParsedArgs } from "minimist";
import { Command } from "./Command.js";
import { Structs } from "node-napcat-ts";
import { readFile } from "fs/promises";
import type { Bot } from "../Bot.js";
import type { MyAI } from "../../ai/MyAI.js";

export class PromptCommand extends Command {
    systemPrompt = "";
    ai: MyAI;
    constructor(bot: Bot, ai: MyAI) {
        super(bot);
        this.ai = ai;
        readFile("prompt.md")
            .then((file) => {
                this.systemPrompt = file.toString("utf-8");
            })
            .catch((err) => {
                throw new Error("无法读取prompt.md");
            });
    }

    async execute(
        groupId: number,
        sender: number,
        argv: ParsedArgs,
        raw: string,
    ) {
        const userPrompt = raw.split(" ").slice(1).join(" ");
        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.text("⌛ 查询API中, 请耐心等候(约1min)"),
        ]);
        try {
            const response = await this.ai.chat([
                { role: "system", content: this.systemPrompt },
                { role: "user", content: userPrompt },
            ]);
            if (response.error) {
                return this.bot.messageSender.sendGroupMsg(groupId, [
                    Structs.text("❌ API查询失败:\n" + response.error),
                ]);
            } else if (response.error === null) {
                return this.bot.messageSender.sendGroupMsg(groupId, [
                    Structs.text(
                        `📄 查询完成 (${Math.round((response.duration / 1000) * 100) / 100}s ${response.token} tokens)\n` +
                        response.thinking +
                        "\n======\n" +
                        response.api.join("\n"),
                    ),
                ]);
            }
        } catch (err) {
            console.error(err);
        }
        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.text("❌ API查询失败"),
        ]);
    }
}
