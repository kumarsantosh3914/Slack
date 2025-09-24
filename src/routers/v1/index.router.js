import express from 'express';
import pingRouter from './ping.router.js';
import userRouter from './user.js';
import workspaceRouter from './workspace.js';
import channelRouter from './channel.js';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/users', userRouter);
v1Router.use('/workspaces', workspaceRouter);
v1Router.use('/channels', channelRouter);

export default v1Router;


