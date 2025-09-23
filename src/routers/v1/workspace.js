import express from "express";
import { validateRequestBody } from "../../validators/index.js";
import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspacesUserIsMemberOfController,
  updatedWorkspaceController,
} from "../../controllers/workspaceController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  createWorkspaceSchema,
} from "../../validators/workspaceSchema.js";

const workspaceRouter = express.Router();

// Create workspace
workspaceRouter.post(
  "/",
  isAuthenticated,
  validateRequestBody(createWorkspaceSchema),
  createWorkspaceController
);

// Get user's workspaces
workspaceRouter.get(
  "/",
  isAuthenticated,
  getWorkspacesUserIsMemberOfController
);

// Delete workspace
workspaceRouter.delete(
  "/:workspaceId",
  isAuthenticated,
  deleteWorkspaceController
);
workspaceRouter.get("/:workspaceId", isAuthenticated, getWorkspaceController);
workspaceRouter.get(
  "/join/:joinCode",
  isAuthenticated,
  getWorkspaceByJoinCodeController
);
workspaceRouter.put(
  "/:workspaceId",
  isAuthenticated,
  updatedWorkspaceController
);
workspaceRouter.put(
  "/:workspaceId/members",
  isAuthenticated,
  validateRequestBody(addMemberToWorkspaceSchema),
  addMemberToWorkspaceController
);
workspaceRouter.put(
  "/:workspaceId/channels",
  isAuthenticated,
  validateRequestBody(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

export default workspaceRouter;
