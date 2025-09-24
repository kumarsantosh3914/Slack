import { StatusCodes } from "http-status-codes";
import { getChannelByIdService } from "../services/channelService.js"

export const getChannelByIdController = async (req, res) => {
    const response = await getChannelByIdService(req.params.channelId, req.user);

    res.status(StatusCodes.OK).json({
        message: "Channel fetched successfully",
        data: response,
        success: true
    });
}