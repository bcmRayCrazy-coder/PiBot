import yaml from "js-yaml";
import { readFile } from "fs/promises";

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
        host: "127.0.0.1",
        port: 6020,
        token: "",
        protocol: "ws",
    };
    bot: EnvBotConfig = {
        admin: 0,
    };

    async loadFromConfig(configPath: string) {
        const rawConig = await readFile(configPath);
        const config = yaml.load(rawConig.toString("utf-8"));
        // console.log(config);
        Object.assign(this, config);
    }
}

export let env = new Env();
