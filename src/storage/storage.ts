export interface Storage {
    query(query: string[]): Promise<string>;
}
