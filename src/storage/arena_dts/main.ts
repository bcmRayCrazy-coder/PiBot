import type { ResourceMetadata } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Storage } from "../storage.js";
import type {
    ListResourcesResult,
    ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { loadDeclaration } from "./load.js";
import type { DeclarationContent } from "../Declaration.js";

interface ResourceContent {
    uri: string;
    content: string;
}

function contentToList(content: ResourceContent[]) {
    return content.map(c => {
        return {
            uri: c.uri,
            name: c.content
        }
    })
}

function contentToRead(content: ResourceContent[]) {
    return content.map(c => {
        return {
            uri: c.uri,
            text: c.content
        }
    })
}

const rootList = [
    {
        uri: "api://client",
        content: "客户端API",
    },
    {
        uri: "api://server",
        content: "服务端API"
    }
]

export class AreanaDtsStorage implements Storage {
    name = "api";
    uriTemplate = "api://{query}";
    config: ResourceMetadata = {
        title: "可用的api列表",
        description: "获取所有可用的api列表, 并仅向用户呈现出现在列表内的api",
        mimeType: "application/json",
    };

    clientDeclaration: DeclarationContent[] = []
    serverDeclaration: DeclarationContent[] = []

    constructor() {
        this.clientDeclaration = loadDeclaration('submodules/arena_dts/ClientAPI.d.ts');
        this.serverDeclaration = loadDeclaration('submodules/arena_dts/GameAPI.d.ts');
    }

    async handleList(): Promise<ListResourcesResult> {
        return {
            resources: contentToList(rootList)
        };
    }
    async handleResource(
        uri: URL,
        param: { query: string },
    ): Promise<ReadResourceResult> {
        const query = param.query.split('%2F');
        console.log(query);
        if (query[0] === 'client') {
            return {
                contents: contentToRead(this.queryApi(query, this.clientDeclaration))
            }
        }
        else if (query[0] === 'server') {
            return {
                contents: contentToRead(this.queryApi(query, this.clientDeclaration))
            }
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: "⚠️ 错误: 该资源不存在, 请使用其它资源(如下)"
                },
                ...contentToRead(rootList)
            ],
        };
    }

    queryApi(query: string[], declaration: DeclarationContent[]): ResourceContent[] {
        if (query.length === 1) return declaration.map(d => {
            return {
                uri: `api://${query[0]}/${d.name}`,
                content: JSON.stringify(d)
            }
        })
        const topDeclaration = declaration.filter(d => d.name === query[1]);
        if (query.length === 2) return topDeclaration.map(d => {
            return {
                uri: `api://${query.join('/')}`,
                content: JSON.stringify(d)
            }
        })
        return [{
            uri:`api://${query.join('/')}`,
            content:'⚠️ 错误: 不存在此API, 请使用其它API'
        }]
    }
}
