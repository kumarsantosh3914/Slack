import { StatusCodes } from "http-status-codes";
import {
  addChannelToWorkspaceService,
  addMemberToWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByJoinCodeService,
  getWorkspaceService,
  getWorkspacesUserIsMemberOfService,
  updatedWorkspaceService,
} from "../services/workspaceService.js";
import { BadRequestError } from "../utils/errors/app.error.js";

export const createWorkspaceController = async (req, res, next) => {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user?._id || req.user,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Workspace created successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspacesUserIsMemberOfController = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user;
    if (!userId) {
      throw new BadRequestError("User ID not found in request");
    }

    const response = await getWorkspacesUserIsMemberOfService(userId);

    res.status(StatusCodes.OK).json({
      message: "Workspaces fetched successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspaceController = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?._id || req.user;

    if (!workspaceId) {
      throw new BadRequestError("Workspace ID is required");
    }

    const response = await deleteWorkspaceService(workspaceId, userId, next);

    res.status(StatusCodes.OK).json({
      message: "Workspace deleted successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceController = async (req, res, next) => {
  try {
    const response = await getWorkspaceService(
      req.params.workspaceId,
      req.user?._id || req.user
    );

    res.status(StatusCodes.OK).json({
      message: "Workspace fetched successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

export const getWorkspaceByJoinCodeController = async (req, res, next) => {
  try {
    const response = await getWorkspaceByJoinCodeService(
      req.params.joinCode,
      req.user?._id || req.user
    );

    res.status(StatusCodes.OK).json({
      message: "Workspace fetched successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updatedWorkspaceController = async (req, res, next) => {
  try {
    const response = await updatedWorkspaceService(
      req.params.workspaceId,
      req.body,
      req.user
    );

    res.status(StatusCodes.OK).json({
      message: "Workspace updated successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const addMemberToWorkspaceController = async (req, res, next) => {
  try {
    const response = await addMemberToWorkspaceService(
      req.params.workspaceId,
      req.body.memberId,
      req.body.role || "member",
      req.user
    );

    res.status(StatusCodes.OK).json({
      message: "Member added to workspace successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const addChannelToWorkspaceController = async (req, res, next) => {
  try {
    const response = await addChannelToWorkspaceService(
      req.params.workspaceId,
      req.body.channelName,
      req.user
    );

    res.status(StatusCodes.OK).json({
      message: "Channel added to workspace successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
