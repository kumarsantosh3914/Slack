import express from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { isMemberPartOfWorkspaceController } from "../../controllers/memberController.js";

const memberRouter = express.Router();

memberRouter.get(
  "/workspace/:workspaceId",
  isAuthenticated,
  isMemberPartOfWorkspaceController
);

export default memberRouter;
