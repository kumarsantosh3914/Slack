import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js'
import { getChannelByIdController } from '../../controllers/channelController.js';

const channelRouter = express.Router();

channelRouter.get('/:channelId', isAuthenticated, getChannelByIdController);

export default channelRouter;