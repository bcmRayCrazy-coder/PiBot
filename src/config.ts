import yaml from "js-yaml";
import { readFile } from "fs/promises";
import { number } from "zod";

export interface AIConfig {
    baseUrl: string;
    apiKey: string;
    model: string;
}
export interface WebConfig {
    port: number;
}
export interface NapcatConfig {
    host: string;
    port: number;
    token: string;
    protocol: "ws" | "wss";
}
export interface BotConfig {
    admin: number;
    messageSendInterval: number;
    groups: number[]
}

class Config {
    envType: string = process.env.ENV_TYPE || "";
    ai: AIConfig = {
        baseUrl: "",
        apiKey: "",
        model: "",
    };
    web: WebConfig = {
        port: 2200,
    };
    napcat: NapcatConfig = {
        host: "127.0.0.1",
        port: 6020,
        token: "",
        protocol: "ws",
    };
    bot: BotConfig = {
        admin: 0,
        messageSendInterval: 0,
        groups: []
    };

    async loadFromConfig(configPath: string) {
        const rawConig = await readFile(configPath);
        const config = yaml.load(rawConig.toString("utf-8"));
        // console.log(config);
        Object.assign(this, config);
    }
}

export let config = new Config();
