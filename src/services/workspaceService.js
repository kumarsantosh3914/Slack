import { v4 as uuidv4 } from "uuid";
import workspaceRepository from "../repositories/workspaceRepository.js";
import Channel from "../models/channel.js";
import { BadRequestError } from "../utils/errors/app.error.js";

export const createWorkspaceService = async (workspaceData) => {
    const name = workspaceData?.name?.trim();
    const description = workspaceData?.description?.trim() || '';
    const ownerId = workspaceData?.owner;

    if (!name || !ownerId) {
        throw new BadRequestError('name and owner are required');
    }

    const joinCode = uuidv4().substring(0, 6).toUpperCase();

    const workspace = await workspaceRepository.create({
        name,
        description,
        joinCode
    });

    await workspaceRepository.addChannelToWorkspace(
        workspace._id,
        ownerId,
        'admin'
    );

    const generalChannel = await Channel.create({
        name: 'general',
        workspaceId: workspace._id
    });

    const final = await workspaceRepository.update(workspace._id, {
        $addToSet: { channels: generalChannel._id }
    }, { newDocument: true, lean: true });

    return final;
}