import userRepository from "../repositories/userRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors/app.error.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  const workspace = await workspaceRepository.getById(workspaceId);

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const isUserMember = isUserMemberOfWorkspace(workspace, memberId);
  if (!isUserMember) {
    throw new UnauthorizedError("User is not a member of the workspace");
  }

  const user = await userRepository.getById(memberId);
  return user;
};
