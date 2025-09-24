import nodemailer from 'nodemailer';
import { serverConfig } from './index.js';

export default nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: serverConfig.MAIL_ID,
        pass: serverConfig.MAIL_PASSWORD
    }
});