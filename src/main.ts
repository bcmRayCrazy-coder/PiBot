import { initMCP } from "./mcp/mcp.js";
import { initWeb } from "./web/web.js";

console.log("Start PiBot");
const webApp = initWeb();
initMCP(webApp);
// setInterval(()=>{},100)
