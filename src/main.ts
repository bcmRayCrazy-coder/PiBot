import { readFile } from "node:fs/promises";
import { initAI } from "./ai/ai.js";
import { env } from "./env.js";
import { initMCP } from "./mcp/mcp.js";
import { initWeb } from "./web/web.js";

async function main() {
    console.log("Start PiBot");
    await env.loadFromConfig(
        `config${env.envType === "TEST" ? ".test" : ""}.yaml`,
    );
    const ai = initAI();
    const webApp = initWeb();
    const mcp = initMCP();
    // await ai.check();
    ai.addMcp(mcp);
    const prompt = await readFile("prompt.md");
    const res = await ai.chat([
        { role: "system", content: prompt.toString("utf-8") },
        { role: "user", content: "向玩家发送消息" },
    ]);
    console.log(res);
}
main();
