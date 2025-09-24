import express from 'express';
import { serverConfig } from './config/index.js';
import v1Router from './routers/v1/index.router.js';
import v2Router from './routers/v2/index.router.js';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware.js';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware.js';
import logger from './config/logger.config.js';
import connectDB from './config/db.config.js';
import mailer from './config/mailConfig.js';

const app = express();

app.use(express.json());

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);

    await connectDB();
    // const mailResponse = await mailer.sendMail({
    //     from: 'santoshchhinchholikar@gmail.com',
    //     to: 'santoshkumar15novmth@gmail.com',
    //     subject: 'Welcome mail from slack!',
    //     text: 'Welcome from the slack server...'
    // });

    // console.log(mailResponse);
});


