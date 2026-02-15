export interface DeclarationContentMember {
    define: string
    docs: string[]
}
export interface DeclarationContent {
    type: 'class' | 'enum' | 'function'|'variable',
    name: string,
    docs: string[],
    members: DeclarationContentMember[]
}