import { serverConfig } from "../../config/index.js"

export const workspaceJoinMail = function (workspace) {
    return {
        from: serverConfig.MAIL_ID,
        subject: 'You have been added to a workspace',
        text: `Congratulations! You have been added to the workspace ${workspace.name}`
    };
};