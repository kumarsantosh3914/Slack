import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import { UnauthorizedError } from "../utils/errors/app.error.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessagesService = async (messageParams, page, limit) => {
  const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
    messageParams.channelId
  );

  const workspace = channelDetails.workspaceId;
  const isMember = isUserMemberOfWorkspace(workspace, user);
  if (!isMember) {
    throw new UnauthorizedError("User is not a member of the workspace");
  }
  const message = await messageRepository.getPaginatedMessaged(
    messageParams,
    page,
    limit
  );

  return message;
};
