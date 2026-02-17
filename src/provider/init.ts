import { AreanaDtsProvider } from "./arena_dts/main.js";
import { providerManager } from "./ProviderManager.js";

export function initProvider() {
    providerManager.registerProvider("arena_dts", new AreanaDtsProvider());
}
