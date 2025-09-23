import express from 'express';
import { validateRequestBody } from '../../validators/index.js';
import { 
    createWorkspaceController, 
    deleteWorkspaceController,
    getWorkspaceController,
    getWorkspacesUserIsMemberOfController 
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';

const workspaceRouter = express.Router();

// Create workspace
workspaceRouter.post('/', isAuthenticated, validateRequestBody(createWorkspaceSchema), createWorkspaceController);

// Get user's workspaces
workspaceRouter.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);

// Delete workspace
workspaceRouter.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

workspaceRouter.get('/:workspaceId', isAuthenticated, getWorkspaceController)

export default workspaceRouter;