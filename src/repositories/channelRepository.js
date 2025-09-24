import Channel from "../models/channel.js";
import crudRepository from "./crudRepository.js";
import { BadRequestError } from "../utils/errors/app.error.js";

const channelRepository = {
    ...crudRepository(Channel),

    getChannelsByWorkspace: async function getChannelsByWorkspace(workspaceId) {
        if (!workspaceId) throw new BadRequestError('workspaceId is required');
        const channels = await Channel.find({ workspaceId })
            .select('name topic isPrivate createdAt')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return channels;
    },

    createChannel: async function createChannel(data) {
        const { name, workspaceId, isPrivate = false, topic = '' } = data;
        if (!name || !workspaceId) throw new BadRequestError('name and workspaceId are required');
        
        const channel = await Channel.create({ name, workspaceId, isPrivate, topic });
        return channel;
    },

    getChannelWithWorkspaceDetails: async function getChannelWithWorkspaceDetails(channelId) {
        const channel = await Channel.findById(channelId).populate('workspaceId');
        return channel;
    }
};

export default channelRepository;