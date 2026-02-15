import {
    ResourceTemplate,
    type McpServer,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { AreanaDtsStorage } from "../../storage/arena_dts/main.js";

export function registerApiResource(server: McpServer) {
    const storage = new AreanaDtsStorage();
    // @ts-ignore
    server.registerResource(
        storage.name,
        new ResourceTemplate("api://{query}", {
            list: async (extra) => {
                return await storage.handleList();
            },
        }),
        storage.config,
        async (uri: URL, param: { query: string }) => {
            return await storage.handleResource(uri, param);
        },
    );
}
