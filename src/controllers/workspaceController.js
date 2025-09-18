import { StatusCodes } from "http-status-codes";
import { createWorkspaceService } from "../services/workspaceService.js"

export const createWorkspaceController = async (req, res) => {
    const response = await createWorkspaceService({
        ...req.body,
        owner: req.user?._id || req.user
    });

    res.status(StatusCodes.CREATED).json({
        message: 'Workspace created successfully',
        data: response,
        success: true,
    });
}