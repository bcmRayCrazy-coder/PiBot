import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerApiResource(server: McpServer) {
    // @ts-ignore
    server.registerResource("api", new ResourceTemplate("api://${query}", {
        list: (extra) => {
            return {
                resources: [{
                    uri: "api://world",
                    name: "🌍 World 世界",
                }]
            }
        }
    }), {
        title: "可用的api列表",
        description: "获取所有可用的api列表, 并仅向用户呈现出现在列表内的api",
        mimeType: "application/json"
    }, async (uri, param) => {
        console.log(uri, param);
    })
}