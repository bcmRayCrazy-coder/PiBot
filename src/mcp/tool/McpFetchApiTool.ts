import { AreanaDtsProvider } from "../../provider/arena_dts/main.js";
import z from "zod";
import type { McpTool } from "../McpTool.js";
import { providerManager } from "../../provider/ProviderManager.js";

export class McpFetchApiTool implements McpTool {
    name = "fetch_api";
    description = "获取API";
    inputSchema = z.object({});

    private provider: AreanaDtsProvider;

    constructor() {
        const provider =
            providerManager.getProvider<AreanaDtsProvider>("arena_dts");
        if (!provider) throw new Error("arena_dts provider not registered");
        this.provider = provider;
    }

    async handler(arg: { type: string; query: string }) {
        var query = [arg.type];
        if (arg.query) query.push(arg.query);
        return await this.provider.query(query);
    }
}
