import { env } from "./env.js";
import { initMCP } from "./mcp/mcp.js";
import { initWeb } from "./web/web.js";

async function main() {
    console.log("Start PiBot");
    await env.loadFromConfig(
        `config${env.envType === "TEST" ? ".test" : ""}.yaml`,
    );
    const webApp = initWeb();
    initMCP(webApp);
}
main();
