import type { ParsedArgs } from "minimist";
import { Command } from "./Command.js";
import type { AreanaDtsProvider } from "../../provider/arena_dts/main.js";
import type { Bot } from "../Bot.js";
import { providerManager } from "../../provider/ProviderManager.js";
import type {
    DeclarationContent,
    DeclarationContentMember,
} from "../../provider/Declaration.js";
import { Structs } from "node-napcat-ts";

export class QueryCommand extends Command {
    private provider: AreanaDtsProvider;

    constructor(bot: Bot) {
        super(bot);
        const provider =
            providerManager.getProvider<AreanaDtsProvider>("arena_dts");
        if (!provider) throw new Error("arena_dts provider not registered");
        this.provider = provider;
    }

    execute(groupId: number, sender: number, argv: ParsedArgs, raw: string) {
        if (argv["Q"]) {
            const result = this.fullMatchQuery(argv["Q"].split("."));
            if (!result)
                return this.bot.messageSender.sendGroupMsg(groupId, [
                    Structs.text(`未找到API "${argv["Q"]}"`),
                ]);
            if (result.type !== "class_full")
                return this.bot.messageSender.sendGroupMsg(groupId, [
                    Structs.text(`${result.type} ${result.name}
${result.docs}
----
${result.members
                            .map((val) => {
                                if (typeof val !== "string") return `${val.define} ${val.docs}`;
                                return val;
                            })
                            .join("\n")}`),
                ]);

            const member = result.members[0] as
                | DeclarationContentMember
                | undefined;
            if (!member) return;
            return this.bot.messageSender.sendGroupMsg(groupId, [
                Structs.text(
                    `class ${result.name}\n` +
                    "----\n" +
                    `${member.define}\n` +
                    `${member.docs}\n`,
                ),
            ]);
        } else if (argv["q"]) {
            // TODO: Blur search
        }
    }

    fullMatchQuery(query: string[]): DeclarationContent | undefined {
        function queryDeclaration(
            query: string[],
            declaration: DeclarationContent[],
        ): DeclarationContent | undefined {
            if (query.length === 1) {
                return declaration.filter(
                    ({ type, name }) =>
                        type !== "class_full" && name === query[0],
                )[0];
            }
            const baseClass = declaration.filter(
                ({ type, name }) => type === "class_full" && name === query[0],
            )[0];
            if (!baseClass) return;
            const member = baseClass.members.filter((member) => {
                if (typeof member === "string") return false;
                return (
                    ((
                        (member.define.split("(")[0] || "").split(" ")[0] || ""
                    ).split(":")[0] || "") === query[1]
                );
            }) as DeclarationContentMember[];
            if (!member[0]) return;
            return {
                type: "class_full",
                name: baseClass.name,
                docs: [],
                members: member,
            };
            // .filter(({ name, members }) => {
            //     console.log(name);
            //     if (name === query[0]) return (members as DeclarationContentMember[]).filter(({ define }) => {
            //         console.log(define);
            //         return (define.split(':')[0] || "").replaceAll("static ", "").replaceAll("readonly ", "I") === query[1]
            //     });
            // })[0];
        }

        const serverQuery = queryDeclaration(
            query,
            this.provider.serverDeclaration,
        );
        if (serverQuery) return serverQuery;
        const clientQuery = queryDeclaration(
            query,
            this.provider.clientDeclaration,
        );
        if (clientQuery) return clientQuery;
        return;
    }
}
