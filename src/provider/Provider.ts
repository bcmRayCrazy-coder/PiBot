export interface Provider {
    query(query: string[]): Promise<string>;
}
