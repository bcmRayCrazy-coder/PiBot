import type { Provider } from "./Provider.js";

export class ProviderManager {
    providers: Map<string, any> = new Map();
    registerProvider(name: string, provider: Provider) {
        this.providers.set(name, provider);
    }
    getProvider<T extends Provider>(name: string): T | undefined {
        return this.providers.get(name);
    }
}

export let providerManager = new ProviderManager();
