import channelRepository from "../repositories/channelRepository.js"
import { NotFoundError, UnauthorizedError } from "../utils/errors/app.error.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js"

export const getChannelByIdService = async (channelId, userId) => {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if(!channel || !channel.workspaceId)  {
        throw new NotFoundError("Invalid data sent from the client");
    }

    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
        channel.workspaceId,
        userId
    );

    if(!isUserMemberOfWorkspace) {
        throw new UnauthorizedError("User is not a member of the workspace");
    }

    return channel;
}