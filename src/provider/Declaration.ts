export interface DeclarationContentMember {
    define: string;
    docs: string[];
}
export interface DeclarationContent {
    type: "class" | "enum" | "function" | "variable" | "class_full";
    name: string;
    docs: string[];
    members: DeclarationContentMember[] | string[];
}
