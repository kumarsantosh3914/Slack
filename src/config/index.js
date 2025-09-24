// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';

function loadEnv() {
    dotenv.config();
    console.log('Environment variables loaded from .env file');
}

loadEnv();

export const serverConfig = {
    PORT: Number(process.env.PORT) || 3000,
    DEV_DB_URL: String(process.env.DEV_DB_URL),
    PROD_DB_URL: String(process.env.PROD_DB_URL),
    NODE_ENV: String(process.env.NODE_ENV),
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_EXPIRY: String(process.env.JWT_EXPIRY),
    MAIL_ID: String(process.env.MAIL_ID),
    MAIL_PASSWORD: String(process.env.MAIL_PASSWORD)
};


