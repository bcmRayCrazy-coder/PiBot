import type { MyAI } from "../ai/MyAI.js";
import { Bot } from "./Bot.js";

export function initBot(ai:MyAI){
    const bot = new Bot(ai);
    bot.init();
}