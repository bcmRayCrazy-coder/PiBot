import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AreanaDtsStorage } from "../../storage/arena_dts/main.js";
import z from "zod";

export function registerFetchApiTool(server: McpServer) {
    const storage = new AreanaDtsStorage();
    server.registerTool(
        "fetch_api",
        {
            description: "获取API",
            inputSchema: z.object({
                type: z.string().describe("API环境类型, 有server和client两种"),
                query: z.string().optional().describe("需要获取的API名"),
            }),
        },
        async (arg) => {
            var query = [arg.type];
            if (arg.query) query.push(arg.query);
            return {
                content: [{ type: "text", text: await storage.query(query) }],
            };
        },
    );
}
