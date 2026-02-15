import { JSDoc, Project } from "ts-morph";
import type { DeclarationContent } from "../Declaration.js";

function parseJsDocs(jsDocs: JSDoc[]) {
    return jsDocs.map(doc => doc.getText())
}

export function loadDeclaration(sourceFilePath: string): DeclarationContent[] {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(sourceFilePath);
    const classes: DeclarationContent[] =
        sourceFile.getClasses().map(declaration => {
            return {
                type: "class",
                name: declaration.getName() || "<Unknown>",
                docs: parseJsDocs(declaration.getJsDocs()),
                members: declaration.getMembers().map(member => {
                    return {
                        define: member.getText(),
                        docs: parseJsDocs(member.getJsDocs())
                    }
                })
            }
        })
    const enums: DeclarationContent[] = sourceFile.getEnums().map(declaration => {
        return {
            type: "enum",
            name: declaration.getName() || "<Unknown>",
            docs: parseJsDocs(declaration.getJsDocs()),
            members: declaration.getMembers().map(member => {
                return {
                    define: member.getName(),
                    docs: parseJsDocs(member.getJsDocs())
                }
            })
        }
    })
    const functions: DeclarationContent[] = sourceFile.getFunctions().map(declaration => {
        return {
            type: "function",
            name: declaration.getName() || "<Unknown>",
            docs: parseJsDocs(declaration.getJsDocs()),
            members: []
        }
    })
    const variables: DeclarationContent[] = sourceFile.getVariableDeclarations().map(declaration => {
        const statement = declaration.getVariableStatement();
        var docs = [];
        if (statement) docs.push(...parseJsDocs(statement.getJsDocs()))
        else docs.push(declaration.getText())
        return {
            type: "variable",
            name: declaration.getName() || "<Unknown>",
            docs,
            members: []
        }
    })
    return classes.concat(enums, functions, variables);
}