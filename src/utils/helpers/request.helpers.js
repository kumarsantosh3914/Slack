import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage  = new AsyncLocalStorage();

export const getCorrelationId = () => {
    const asyncStore = asyncLocalStorage.getStore();
    return asyncStore?.correlationId || "unknown-error-while-creating-correlation-id";
}


