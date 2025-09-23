import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(3, 'Workspace name must be at least 3 characters').max(50, 'Workspace name must be at most 50 characters'),
    description: z.string().trim().max(1024, 'Description too long').optional().default('')
});

export const addMemberToWorkspaceSchema = z.object({
    memberId: z.string()
});

export const addChannelToWorkspaceSchema = z.object({
    channelName: z.string()
});