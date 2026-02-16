import type { ZodObject } from "zod";
import type z from "zod";
import type { ZodStandardJSONSchemaPayload } from "zod/v4/core";

export interface McpTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject;
    handler(arg: any): Promise<string>;
}
