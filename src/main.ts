import { initAI } from "./ai/init.js";
import { config } from "./config.js";
import { initMCP } from "./mcp/init.js";
import { initBot } from "./bot/init.js";
import { initProvider } from "./provider/init.js";

async function main() {
    console.log("Start PiBot");
    await config.loadFromConfig(
        `config${config.envType === "TEST" ? ".test" : ""}.yaml`,
    );
    initProvider();
    const ai = initAI();
    const mcp = initMCP();
    console.log("Checking AI...");
    if (!await ai.check()) throw new Error("Unable to use AI");
    ai.addMcp(mcp);
    initBot(ai);
}
main();
