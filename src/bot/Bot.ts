import { NCWebsocket } from "node-napcat-ts";
import { MessageSender } from "./MessageSender.js";
import { config } from "../config.js";

export class Bot {
    bot: NCWebsocket;
    selfId = 0;
    messageSender: MessageSender

    constructor() {
        this.bot = new NCWebsocket({
            protocol: config.napcat.protocol,
            host: config.napcat.host,
            port: config.napcat.port,
            accessToken: config.napcat.token,
            throwPromise: true,
            reconnection: {
                enable: true,
                attempts: 10,
                delay: 5000
            }
        }, false);
        this.messageSender = new MessageSender(this.bot, config.bot.messageSendInterval);
    }

    init() {
        console.log("Connecting to bot...")
        this.bot.connect().then(async () => {
            const loginInfo = await this.bot.get_login_info();
            this.selfId = loginInfo.user_id;
            this.messageSender.startPolling();
            console.log("Bot Connected");
        }).catch(err => {
            console.error(err);
            console.error('Error when connecting to bot')
        });
        
        this.listen();
    }

    listen(){}
}