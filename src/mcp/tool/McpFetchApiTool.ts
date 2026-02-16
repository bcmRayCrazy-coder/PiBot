import { AreanaDtsProvider } from "../../provider/arena_dts/main.js";
import z from "zod";
import type { McpTool } from "../McpTool.js";

export class McpFetchApiTool implements McpTool {
    name = "fetch_api";
    description = "获取API";
    inputSchema = z.object({});

    private storage = new AreanaDtsProvider();

    async handler(arg: { type: string; query: string }) {
        var query = [arg.type];
        if (arg.query) query.push(arg.query);
        return await this.storage.query(query);
    }
}
