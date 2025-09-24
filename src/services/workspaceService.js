import { v4 as uuidv4 } from "uuid";
import workspaceRepository from "../repositories/workspaceRepository.js";
import Channel from "../models/channel.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors/app.error.js";
import channelRepository from "../repositories/channelRepository.js";
import userRepository from "../repositories/userRepository.js";

const isUserAdminOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === "admin"
  );
};

const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (menubar) => menubar.memberId.toString() === userId
  );
};

export const createWorkspaceService = async (workspaceData) => {
  const name = workspaceData?.name?.trim();
  const description = workspaceData?.description?.trim() || "";
  const ownerId = workspaceData?.owner;

  if (!name || !ownerId) {
    throw new BadRequestError("name and owner are required");
  }

  const joinCode = uuidv4().substring(0, 6).toUpperCase();

  const workspace = await workspaceRepository.create({
    name,
    description,
    joinCode,
  });

  await workspaceRepository.addMemberToWorkspace(
    workspace._id,
    ownerId,
    "admin"
  );

  const generalChannel = await Channel.create({
    name: "general",
    workspaceId: workspace._id,
  });

  const final = await workspaceRepository.update(
    workspace._id,
    {
      $addToSet: { channels: generalChannel._id },
    },
    { newDocument: true, lean: true }
  );

  return final;
};

export const getWorkspacesUserIsMemberOfService = async (userId) => {
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  const workspaces = await workspaceRepository.fetchALlWorkspaceByMemberId(
    userId
  );
  return workspaces;
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  if (!workspaceId || !userId) {
    throw new BadRequestError("workspaceId and userId are required");
  }

  const workspace = await workspaceRepository.getById(workspaceId, {
    lean: true,
  });

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isAdmin = workspace.members.find(
    (member) =>
      member.memberId.toString() === userId.toString() &&
      member.role === "admin"
  );

  if (!isAdmin) {
    throw new BadRequestError("Only workspace admins can delete the workspace");
  }

  // Delete associated channels
  if (workspace.channels && workspace.channels.length > 0) {
    await channelRepository.deleteMany(workspace.channels);
  }

  const deletedWorkspace = await workspaceRepository.delete(workspaceId);
  return deletedWorkspace;
};

export const getWorkspaceService = async (workspaceId, userId) => {

  // Get workspace with essential information
  const workspace = await workspaceRepository.getById(workspaceId, {
    select: 'name description joinCode members channels isPublic createdAt updatedAt owner',
    populate: [
      { 
        path: 'members.memberId',
        select: 'username email'
      },
      {
        path: 'channels',
        select: 'name description isPrivate members'
      }
    ]
  });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  // Convert userId to string for comparison
  const userIdStr = userId.toString();

  // Check if workspace is public or user is a member
  const isMember = workspace.members.some(member => member.memberId._id.toString() === userIdStr);
  const isOwner = workspace.owner?.toString() === userIdStr;

  if (!workspace.isPublic && !isMember && !isOwner) {
    throw new UnauthorizedError('You do not have access to this workspace. Please request an invite from a workspace admin.');
  }

  // Get user's role in the workspace
  const userRole = isMember 
    ? workspace.members.find(member => member.memberId._id.toString() === userIdStr)?.role 
    : 'none';

  // Convert to plain object if it's a mongoose document
  const workspaceData = workspace.toObject ? workspace.toObject() : workspace;

  // Return workspace with additional context
  return {
    ...workspaceData,
    userRole,
    memberCount: workspace.members.length,
    channelCount: workspace.channels.length,
    // Only send sensitive data if user is a member
    members: isMember || isOwner ? workspace.members : undefined,
    channels: isMember || isOwner ? workspace.channels : workspace.channels.filter(c => !c.isPrivate),
    // Remove sensitive or unnecessary fields
    __v: undefined,
  };
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  // Input validation
  if (!joinCode) {
    throw new BadRequestError('Join code is required');
  }
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  // Get workspace with needed information
  const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
  
  if (!workspace) {
    throw new NotFoundError('No workspace found with this join code');
  }

  // Check if user is already a member
  const isMember = isUserMemberOfWorkspace(workspace, userId);
  if (isMember) {
    throw new BadRequestError('You are already a member of this workspace');
  }

  // Return workspace with minimal information for joining
  return {
    _id: workspace._id,
    name: workspace.name,
    description: workspace.description,
    memberCount: workspace.members?.length || 0,
    joinCode: workspace.joinCode
  };
};

export const updatedWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  // Get current workspace state
  const workspace = await workspaceRepository.getById(workspaceId);
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  // Check if user is an admin
  const isAdmin = isUserAdminOfWorkspace(workspace, userId);
  if (!isAdmin) {
    throw new UnauthorizedError('Only workspace admins can update workspace settings');
  }

  // Validate workspace name if provided
  if (workspaceData.name) {
    if (workspaceData.name.trim().length < 3) {
      throw new BadRequestError('Workspace name must be at least 3 characters long');
    }
    if (workspaceData.name.trim().length > 50) {
      throw new BadRequestError('Workspace name cannot exceed 50 characters');
    }
    workspaceData.name = workspaceData.name.trim();
  }

  // Validate description if provided
  if (workspaceData.description) {
    if (workspaceData.description.trim().length > 500) {
      throw new BadRequestError('Workspace description cannot exceed 500 characters');
    }
    workspaceData.description = workspaceData.description.trim();
  }

  // Add metadata
  workspaceData.updatedAt = new Date();
  workspaceData.updatedBy = userId;

  // Update the workspace
  const updatedWorkspace = await workspaceRepository.update(
    workspaceId,
    workspaceData,
    { new: true, runValidators: true }
  );

  return {
    _id: updatedWorkspace._id,
    name: updatedWorkspace.name,
    description: updatedWorkspace.description,
    isPublic: updatedWorkspace.isPublic,
    updatedAt: updatedWorkspace.updatedAt
  };
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  // Validate role
  const allowedRoles = ['admin', 'member'];
  if (!allowedRoles.includes(role)) {
    throw new BadRequestError('Invalid role. Must be either "admin" or "member"');
  }
;
    // Get workspace with member details
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    // Check if user is an admin
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new UnauthorizedError('Only workspace admins can add members');
    }

    // Validate the user to be added
    const userToAdd = await userRepository.getById(memberId);
    if (!userToAdd) {
      throw new NotFoundError('User to be added not found');
    }

    // Check if user is already a member
    const isMember = workspace.members.some(
      member => member.memberId.toString() === memberId.toString()
    );
    if (isMember) {
      throw new BadRequestError('User is already a member of this workspace');
    }

    // Check workspace member limit if any
    if (workspace.members.length >= workspace.memberLimit) {
      throw new BadRequestError('Workspace has reached its member limit');
    }

    // Add member to workspace
    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role,
    );

    // Add user to all public channels in the workspace
    if (workspace.channels && workspace.channels.length > 0) {
      await channelRepository.addMemberToPublicChannels(
        workspace.channels,
        memberId,
      );
    }

    // Return minimal response
    return {
      _id: updatedWorkspace._id,
      name: updatedWorkspace.name,
      memberCount: updatedWorkspace.members.length,
      newMember: {
        id: userToAdd._id,
        username: userToAdd.username,
        role: role
      }
    };
};

const isChannelInWorkspace = (workspace, channelName) => {
  return workspace.channels.some(channel => 
    channel.name.toLowerCase() === channelName.toLowerCase()
  );
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  const workspace = await workspaceRepository.getWorkspaceDetailsById(
    workspaceId
  );
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isAdmin = isUserAdminOfWorkspace(workspace, userId);
  if (!isAdmin) {
    throw new UnauthorizedError("User is not an admin of the workspace");
  }

  // Check if channel already exists
  if (isChannelInWorkspace(workspace, trimmedChannelName)) {
    throw new BadRequestError("Channel with this name already exists in the workspace");
  }

  // Create new channel
  const newChannel = await Channel.create({
    name: trimmedChannelName,
    workspaceId: workspace._id,
    createdBy: userId
  });

  // Add channel to workspace
  const updatedWorkspace = await workspaceRepository.update(
    workspaceId,
    { 
      $addToSet: { channels: newChannel._id },
      updatedAt: new Date(),
      updatedBy: userId
    },
    { new: true }
  );

  return {
    _id: newChannel._id,
    name: newChannel.name,
    workspaceId: workspace._id,
    createdAt: newChannel.createdAt,
    createdBy: userId
  };
};
