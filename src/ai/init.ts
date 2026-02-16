import { config } from "../config.js";
import { MyAI } from "./MyAI.js";

export function initAI() {
    const ai = new MyAI(config.ai.baseUrl, config.ai.apiKey);
    ai.model = config.ai.model;
    return ai;
}
