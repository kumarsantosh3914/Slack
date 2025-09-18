import crudRepository from './crudRepository.js';
import Workspace from '../models/workspace.js';
import User from '../models/user.js';
import { NotFoundError, BadRequestError } from '../utils/errors/app.error.js';

const workspaceRepository = {
    ...crudRepository(Workspace),

    getWorkspaceName: async function getWorkspaceName(workspaceName) {
        const name = workspaceName?.trim();
        if (!name) throw new BadRequestError('Workspace name is required');

        const workspace = await Workspace.findOne({ name })
            .lean()
            .exec();
        if (!workspace) {
            throw new NotFoundError('Workspace not found');
        }
        return workspace;
    },

    addMemberToWorkspace: async function addMemberToWorkspace(joinCode) {
        const code = joinCode?.trim();
        if (!code) throw new BadRequestError('Join code is required');

        const workspace = await Workspace.findOne({ joinCode: code })
            .lean()
            .exec();
        if (!workspace) {
            throw new NotFoundError('Workspace not found');
        }
        return workspace;
    },

    // Note: despite name, this currently adds a member to workspace
    addChannelToWorkspace: async function addChannelToWorkspace(workspaceId, memberId, role = 'member') {
        if (!workspaceId || !memberId) throw new BadRequestError('workspaceId and memberId are required');
        if (!['admin', 'member'].includes(role)) throw new BadRequestError('Invalid role');

        const user = await User.findById(memberId).select('_id').lean().exec();
        if (!user) throw new NotFoundError('User not found');

        const updated = await Workspace.findOneAndUpdate(
            { _id: workspaceId, 'members.memberId': { $ne: memberId } },
            { $addToSet: { members: { memberId, role } } },
            { new: true }
        ).lean().exec();

        if (!updated) {
            throw new BadRequestError('User already part of workspace or workspace not found');
        }

        return updated;
    },

    getWorkspaceByJoinCode: async function getWorkspaceByJoinCode(joinCode) {
        const code = joinCode?.trim();
        if (!code) throw new BadRequestError('Join code is required');
        const workspace = await Workspace.findOne({ joinCode: code }).lean().exec();
        if (!workspace) throw new NotFoundError('Workspace not found');
        return workspace;
    },

    fetchALlWorkspaceByMemberId: async function fetchALlWorkspaceByMemberId(memberId) {
        if (!memberId) throw new BadRequestError('memberId is required');
        const workspaces = await Workspace.find({ 'members.memberId': memberId })
            .select('name description members channels createdAt')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return workspaces;
    }, 
};

export default workspaceRepository;