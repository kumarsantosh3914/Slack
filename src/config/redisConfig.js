import { serverConfig } from "./index.js";

export default {
    host: serverConfig.REDIS_HOST,
    port: serverConfig.REDIS_PORT,
}