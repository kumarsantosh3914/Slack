import mongoose from "mongoose";
import { serverConfig } from "./index.js";
import logger from "./logger.config.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

export default async function connectDB() {
    const mongoUri = serverConfig.NODE_ENV === 'production' ? serverConfig.PROD_DB_URL : serverConfig.DEV_DB_URL;

    if (!mongoUri) {
        logger.error('MongoDB connection URI not provided. Check DEV_DB_URL/PROD_DB_URL in env');
        throw new Error('Missing MongoDB URI');
    }

    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            await mongoose.connect(mongoUri, { autoIndex: true });
            logger.info(`Connected to MongoDB (${serverConfig.NODE_ENV})`);
            return mongoose.connection;
        } catch (error) {
            attempt += 1;
            logger.error(`MongoDB connection attempt ${attempt} failed`, { error: error?.message });
            if (attempt >= MAX_RETRIES) {
                throw error;
            }
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
        }
    }
}