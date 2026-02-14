import { createReadStream } from "fs";

export interface EnvWebConfig {
    port: number;
}
export interface EnvNapcatConfig {
    host: string;
    port: number;
    token: string;
    protocol: "ws" | "wss";
}
export interface EnvBotConfig {
    admin: number;
}
class Env {
    envType: string = process.env.ENV_TYPE || "";
    web: EnvWebConfig = {
        port: 2200,
    };
    napcat: EnvNapcatConfig = {
        host: process.env.NC_HOST || "127.0.0.1",
        port: parseInt(process.env.NC_PORT || "6020"),
        token: process.env.NC_TOKEN || "",
        protocol: (process.env.NC_PROTOCOL as "ws" | "wss") || "ws",
    };
    bot: EnvBotConfig = {
        admin: parseInt(process.env.BOT_ADMIN || "0"),
    };
}

export let env = new Env();
