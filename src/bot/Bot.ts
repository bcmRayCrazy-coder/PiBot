import { NCWebsocket } from "node-napcat-ts";
import { MessageSender } from "./MessageSender.js";
import { config } from "../config.js";
import { CommandManager } from "./command/CommandManager.js";
import type { MyAI } from "../ai/MyAI.js";

export class Bot {
    bot: NCWebsocket;
    selfId = 0;
    messageSender: MessageSender;
    commandManager;

    constructor(ai: MyAI) {
        this.bot = new NCWebsocket(
            {
                protocol: config.napcat.protocol,
                host: config.napcat.host,
                port: config.napcat.port,
                accessToken: config.napcat.token,
                throwPromise: true,
                reconnection: {
                    enable: true,
                    attempts: 10,
                    delay: 5000,
                },
            },
            false,
        );
        this.messageSender = new MessageSender(
            this.bot,
            config.bot.messageSendInterval,
        );
        this.commandManager = new CommandManager(this, ai);
    }

    init() {
        console.log("Connecting to bot...");
        this.bot
            .connect()
            .then(async () => {
                const loginInfo = await this.bot.get_login_info();
                this.selfId = loginInfo.user_id;
                this.messageSender.startPolling();
                console.log("Bot Connected");
            })
            .catch((err) => {
                console.error(err);
                console.error("Error when connecting to bot");
            });

        this.listen();
    }

    listen() {
        this.bot.on("message.group.normal", (ctx) => {
            if (!config.bot.groups.includes(ctx.group_id)) return;
            const message0 = ctx.message[0];
            if (
                !message0 ||
                message0.type !== "text" ||
                !message0.data.text.startsWith("api")
            )
                return;
            this.commandManager.execute(
                ctx.group_id,
                ctx.sender.user_id,
                message0.data.text,
            );
        });
    }
}
