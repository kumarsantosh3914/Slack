import logger from "../config/logger.config.js";
import mailQueue from "../queues/mailQueue.js";

export const addEmailToMailQueue = async (emailData) => {
    if (!emailData || typeof emailData !== 'object') {
        throw new Error('Invalid email data provided');
    }

    try {
        logger.info('Initiating email queue process:', {
            recipient: emailData.to,
            subject: emailData.subject
        });

        const job = await mailQueue.add(emailData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        logger.info('Email successfully queued:', {
            jobId: job.id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to add email to queue:', {
            error: error.message,
            stack: error.stack,
            emailData: { ...emailData, body: '[[REDACTED]]' }
        });
        throw error; // Re-throw to allow handling by caller
    }
};