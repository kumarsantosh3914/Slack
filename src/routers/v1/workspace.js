import express from 'express';
import { validateRequestBody } from '../../validators/index.js';
import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';

const workspaceRouter = express.Router();

workspaceRouter.post('/', isAuthenticated, validateRequestBody(createWorkspaceSchema), createWorkspaceController);

export default workspaceRouter;