import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Express } from "express";
import { randomUUID } from "crypto";
import { registerFetchContentTool } from "./tool/fetchContent.js";
import { registerApiResource } from "./resource/api.js";

export function initMCP(app: Express) {
    console.log("Init MCP");
    const server = new McpServer({
        name: "API Service",
        version: "1.0.0",
    });

    registerApiResource(server);
    registerFetchContentTool(server);

    const sessions: Map<string | string[], StreamableHTTPServerTransport> =
        new Map();

    app.post("/mcp", async (req, res) => {
        const sessionId = req.headers["mcp-session-id"];

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, DELETE, OPTIONS",
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, mcp-session-id",
        );

        if (!!sessionId) {
            const transport = sessions.get(sessionId);
            if (!!transport) {
                await transport.handleRequest(req, res, req.body);
                return;
            }
        }
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized(sessionId) {
                server
                    // @ts-ignore
                    .connect(transport)
                    .then(() => {
                        console.log("Create MCP Session", sessionId);
                    })
                    .catch(console.error);
                sessions.set(sessionId, transport);
                transport.onclose = () => {
                    console.log("Delete MCP Session", sessionId);
                    sessions.delete(sessionId);
                };
            },
        });
        await transport.handleRequest(req, res, req.body);
    });

    app.delete("/mcp", async (req, res) => {
        const sessionId = req.headers["mcp-session-id"];
        if (!sessionId) return res.status(400);
        const transport = sessions.get(sessionId);
        if (!transport) return res.status(400);
        transport.close();
    });
}
