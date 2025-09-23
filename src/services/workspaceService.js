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

  await workspaceRepository.addChannelToWorkspace(
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
  const workspace = await workspaceRepository.getById(workspaceId);

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isMember = isUserMemberOfWorkspace(workspace, userId);
  if (!isMember) {
    throw new UnauthorizedError("User is not a member of the workspace");
  }

  return workspace;
};

export const getWorkspaceByJoinCodeService = async (joinCode) => {
  const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isMember = isUserMemberOfWorkspace(workspace, userId);
  if (!isMember) {
    throw new UnauthorizedError("User is not a member of the workspace");
  }

  return workspace;
};

export const updatedWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  const workspace = await workspaceRepository.getById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isAdmin = isUserAdminOfWorkspace(workspace, userId);
  if (!isAdmin) {
    throw new UnauthorizedError("User is not an admin of the workspace");
  }

  const updatedWorkspace = await workspaceRepository.update(
    workspaceId,
    workspaceData
  );

  return updatedWorkspace;
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  const workspace = await workspaceRepository.getById(workspaceId);
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isAdmin = isUserAdminOfWorkspace(workspace, userId);
  if (!isAdmin) {
    throw new UnauthorizedError("User is not an admin of the workspace");
  }

  const isValidUser = await userRepository.getById(memberId);
  if (!isValidUser) {
    throw new NotFoundError("User not found");
  }

  const isMember = isUserMemberOfWorkspace(workspace, memberId);
  if (isMember) {
    throw new UnauthorizedError("User is not a member of the workspace");
  }

  const response = await workspaceRepository.addMemberToWorkspace(
    workspaceId,
    memberId,
    role
  );

  return response;
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

  const isChannelPartOfWorkspace = isChannelPartOfWorkspace(
    workspace,
    channelName
  );
  if (isChannelPartOfWorkspace) {
    throw new ForbiddenError("Channel already part of workspace");
  }

  const response = await workspaceRepository.addChannelToWorkspace(
    workspaceId,
    channelName
  );

  return response;
};
