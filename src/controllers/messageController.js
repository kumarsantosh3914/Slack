import { StatusCodes } from "http-status-codes";
import { getMessagesService } from "../services/messageService.js";

export const getMessages = async (req, res) => {
  const message = await getMessagesService(
    { channelId: req.params.channelId },
    req.query.page || 1,
    req.query.limit || 20,
    req.user
  );

  res.status(StatusCodes.OK).json({
    message: "Messages Fetched Successfully",
    data: message,
    success: true,
  });
};
