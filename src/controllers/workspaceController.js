import { StatusCodes } from "http-status-codes";
import { createWorkspaceService, deleteWorkspaceService, getWorkspaceService, getWorkspacesUserIsMemberOfService } from "../services/workspaceService.js";
import { BadRequestError } from "../utils/errors/app.error.js";

export const createWorkspaceController = async (req, res, next) => {
    try {
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user?._id || req.user
        });

        res.status(StatusCodes.CREATED).json({
            message: 'Workspace created successfully',
            data: response,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export const getWorkspacesUserIsMemberOfController = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user;
        if (!userId) {
            throw new BadRequestError('User ID not found in request');
        }

        const response = await getWorkspacesUserIsMemberOfService(userId);
        
        res.status(StatusCodes.OK).json({
            message: 'Workspaces fetched successfully',
            data: response,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteWorkspaceController = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user?._id || req.user;

        if (!workspaceId) {
            throw new BadRequestError('Workspace ID is required');
        }

        const response = await deleteWorkspaceService(workspaceId, userId);

        res.status(StatusCodes.OK).json({
            message: 'Workspace deleted successfully',
            data: response,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export const getWorkspaceController = async (req, res) => {
    try {
        const response = await getWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        
        res.status(StatusCodes.OK).json({
            message: 'Workspace fetch successfully',
            data: response,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}