export interface Storage {
    query(query:string[]):Promise<string>
    // name: string;
    // uriTemplate: string;
    // config: ResourceMetadata;
    // handleList(): Promise<ListResourcesResult>;
    // handleResource(uri: URL, param: any): Promise<ReadResourceResult>;
}
