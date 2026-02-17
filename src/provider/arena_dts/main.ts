import type { Provider } from "../Provider.js";
import { loadDeclaration } from "./loader.js";
import type { DeclarationContent } from "../Declaration.js";

interface ResourceContent {
    uri: string;
    content: string;
}

function fallbackText(query: string[]) {
    return [
        {
            uri: `api://${query.join("/")}`,
            content: `⚠️ 错误: 该api不存在, 请查询其他api, ${(/^[A-Z]/.test(query[1] || "a") && query[0] === 'server') ? `你也可以尝试搜索 Game${query[1]}` : ""}
api推荐:
1. 服务端: world(世界), voxels(方块), remoteChannel(与客户端通信), GameEntity(模型,实体,玩家), GamePlayer(玩家)
2. 客户端: ui(UI界面), remoteChannel(与服务端通信)`,
        },
    ];
}

export class AreanaDtsProvider implements Provider {
    clientDeclaration: DeclarationContent[] = [];
    serverDeclaration: DeclarationContent[] = [];

    constructor() {
        this.clientDeclaration = loadDeclaration(
            "submodules/arena_dts/ClientAPI.d.ts",
        );
        this.serverDeclaration = loadDeclaration(
            "submodules/arena_dts/GameAPI.d.ts",
        );
    }

    async query(query: string[]): Promise<string> {
        console.log(query);
        if (query[0] === "client") {
            return JSON.stringify(this.queryApi(query, this.clientDeclaration));
        } else if (query[0] === "server") {
            return JSON.stringify(this.queryApi(query, this.serverDeclaration));
        }
        return "⚠️ 错误: 该type不存在, 请查询其他server或client";
    }

    queryApi(
        query: string[],
        declaration: DeclarationContent[],
    ): ResourceContent[] {
        var result: ResourceContent[] = [];
        if (query.length === 1) {
            result = declaration
                .filter((d) => d.type != "class_full")
                .map((d) => {
                    return {
                        uri: `api://${query[0]}/${d.name}`,
                        content: JSON.stringify(d),
                    };
                });
        } else if (query.length === 2) {
            const topDeclaration = declaration.filter(
                (d) => d.name === query[1] && d.type != "class",
            );
            result = topDeclaration.map((d) => {
                return {
                    uri: `api://${query.join("/")}`,
                    content: JSON.stringify(d),
                };
            });
        }
        return result.length > 0 ? result : fallbackText(query);
    }
}
