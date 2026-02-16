import { McpFetchApiTool } from "./tool/McpFetchApiTool.js";
import type { McpTool } from "./McpTool.js";
import type { ChatCompletionTool } from "openai/resources.js";

export class MyMcp {
    name = "API查询";
    version = "1.0.0";

    tools: Map<string, McpTool> = new Map();

    registerTools() {
        const fetchApi = new McpFetchApiTool();
        this.tools.set(fetchApi.name, fetchApi);
    }

    async getTools() {
        var list: ChatCompletionTool[] = [];
        this.tools.forEach((tool) => {
            list.push({
                type: "function",
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.inputSchema.toJSONSchema(),
                },
            });
        });
        return list;
    }

    async hasTool(toolName: string): Promise<boolean> {
        return this.tools.has(toolName);
    }

    async callTool(toolName: string, args: any): Promise<string> {
        const tool = this.tools.get(toolName);
        if (!tool) return `工具${toolName}不存在`;
        return await tool.handler(args);
    }
}
