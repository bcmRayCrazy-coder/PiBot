import { MyMcp } from "./MyMcp.js";

export function initMCP() {
    const mcp = new MyMcp();
    mcp.registerTools();
    return mcp;
}
