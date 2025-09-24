import logger from "../config/logger.config.js";
import mailConfig from "../config/mailConfig.js";
import mailer from '../config/mailConfig.js';

mailConfig.process(async (job) => {
    const { id, data: emailData } = job;
    
    try {
        logger.info(`Starting email processing for job ${id}`, { emailData });

        // Input validation
        if (!emailData || !emailData.to || !emailData.subject) {
            throw new Error('Invalid email data provided');
        }

        const response = await mailer.sendMail(emailData);
        
        logger.info(`Email sent successfully for job ${id}`, {
            messageId: response.messageId,
            jobId: id
        });

        return response;

    } catch (error) {
        logger.error(`Failed to process email for job ${id}`, {
            error: error.message,
            stack: error.stack,
            emailData
        });
        
        // Re-throw the error to let the job queue handle the failure
        throw error;
    }
});