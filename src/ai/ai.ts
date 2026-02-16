import { OpenAI } from "openai/client.js";
import { env } from "../env.js";
import type { MyMcp } from "../mcp/mcp.js";
import type {
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
    ChatCompletionTool,
} from "openai/resources.js";
import z from "zod";

export function initAI() {
    const ai = new AI(env.ai.baseUrl, env.ai.apiKey);
    ai.model = env.ai.model;
    return ai;
}

export type AIChatResult = {
    error?: string;
} | {
    thinking: string;
    api: string[];
    duration: number;
    token: number;
    callTimes: number;
}

interface CompletionResult {
    messages: ChatCompletionMessageParam[],
    finished: boolean,
    token: number,
    callTimes: number
}

const ResultValidation = z.object({
    thinking: z.string(),
    api: z.array(z.string())
})

export class AI {
    model: string = "";
    openAI: OpenAI;
    mcpInstances: MyMcp[] = [];

    constructor(baseUrl: string, apiKey: string) {
        this.openAI = new OpenAI({
            baseURL: baseUrl,
            apiKey,
        });
    }

    addMcp(mcp: MyMcp) {
        this.mcpInstances.push(mcp);
    }

    private async getAvailableTools() {
        var tools: ChatCompletionTool[] = [];
        for (const mcp of this.mcpInstances) {
            tools.push(...(await mcp.getTools()));
        }
        return tools;
    }

    private async chatCompletion(params: ChatCompletionCreateParamsNonStreaming): Promise<CompletionResult> {
        var finished = true;
        var token = 0;
        var callTimes = 0;
        const msgList: ChatCompletionMessageParam[] = [];
        const completion =
            await this.openAI.chat.completions.create(params);

        if (completion.usage) token += completion.usage.total_tokens;

        if (completion.choices[0]) {
            const msg = completion.choices[0].message;
            msgList.push(msg);
            if (msg.tool_calls) {
                finished = false;
                const toolResults: ChatCompletionMessageParam[] = [];
                for (const toolCall of msg.tool_calls) {
                    if (toolCall.type == 'function') {
                        const arg = JSON.parse(toolCall.function.arguments);
                        const it = this.mcpInstances.values()
                        var mcp = it.next();
                        while (!mcp.done) {
                            if (await mcp.value.hasTool(toolCall.function.name)) {
                                toolResults.push({
                                    role: 'tool',
                                    tool_call_id: toolCall.id,
                                    content: JSON.stringify([{ content: 'text', text: await mcp.value.callTool(toolCall.function.name, arg) }])
                                });
                                callTimes++;
                                break;
                            }
                            mcp = it.next();
                        }
                    }
                }
                msgList.push(...toolResults)
            }
        }
        return { messages: msgList, finished, callTimes, token };
    }

    async chat(messages: ChatCompletionMessageParam[]): Promise<AIChatResult> {
        const startTime = Date.now();
        try {
            const availableTools = await this.getAvailableTools();
            var params: ChatCompletionCreateParamsNonStreaming = {
                model: this.model,
                messages,
            };
            if (availableTools.length > 0) {
                params.tools = availableTools;
                params.tool_choice = "auto";
            }

            var result: CompletionResult = {
                messages,
                finished: false,
                callTimes: 0,
                token: 0
            }
            while (!result.finished) {
                params.messages = result.messages;
                const currentResult = await this.chatCompletion(params);
                result.finished = currentResult.finished;
                result.messages.push(...currentResult.messages);
                result.callTimes += currentResult.callTimes;
                result.token += currentResult.token;
            }


            // Parse Output
            var chatResult0 = result.messages[result.messages.length - 1]
            // console.log(chatResult0);
            if (!chatResult0 || !chatResult0.content || typeof (chatResult0.content) !== 'string') return {
                error: "No Result 0"
            }
            var chatResult1 = chatResult0.content;

            // var chatResult1 = chatResult0.content.match(/```json\n([\s\S]*?)\n```/)
            // if (!chatResult1 || chatResult1.length === 0) return {
            //     error: "No Result 1"
            // }
            var chatResult2 = chatResult1;
            if (!chatResult2) return {
                error: "No Result 2"
            }

            // console.log(chatResult2);

            const parsedResult = ResultValidation.parse(JSON.parse(chatResult2));

            return {
                thinking: parsedResult.thinking,
                api: parsedResult.api,
                duration: Date.now() - startTime,
                token: result.token,
                callTimes: result.callTimes
            };
        } catch (err) {
            console.error(err);
            return {
                error: JSON.stringify(err) || "Unknown error",
            };
        }
    }

    async check(): Promise<boolean> {
        try {
            await this.openAI.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: "You are an assistant" },
                    { role: "user", content: "Hi" },
                ],
            });
            // console.log(completion.choices[0]?.message);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
