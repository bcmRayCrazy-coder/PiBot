import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod/v4";

export function registerFetchContentTool(server: McpServer) {
    server.registerTool(
        "fetch_content",
        {
            description: "Fetch content from web page",
            inputSchema: z.object({ url: z.string().describe("Fetch URL") }),
        },
        async (arg) => {
            try {
                const a = await fetch(arg.url);
                return {
                    content: [
                        {
                            type: "text",
                            text: await a.text(),
                        },
                    ],
                };
            } catch (err) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Unable to fetch!",
                        },
                    ],
                };
            }
        },
    );
}
