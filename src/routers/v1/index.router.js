import express from 'express';
import pingRouter from './ping.router.js';
import userRouter from './user.js';
import workspaceRouter from './workspace.js';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/users', userRouter);
v1Router.use('/workspaces', workspaceRouter);

export default v1Router;


