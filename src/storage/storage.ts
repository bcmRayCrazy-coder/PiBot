import type { ResourceMetadata } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
    ListResourcesResult,
    ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";

export interface Storage {
    name: string;
    uriTemplate: string;
    config: ResourceMetadata;
    handleList(): Promise<ListResourcesResult>;
    handleResource(uri: URL, param: any): Promise<ReadResourceResult>;
}
