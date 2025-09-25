import { StatusCodes } from "http-status-codes";
import { isMemberPartOfWorkspaceService } from "../services/memberService.js"

export const isMemberPartOfWorkspaceController = async (req, res) => {
    const response = await isMemberPartOfWorkspaceService(
        req.params.workspaceId,
        req.user
    );

    res.status(StatusCodes.OK).json({
        message: 'User is a member of the workspace',
        data: response,
        success: true,
    })
}