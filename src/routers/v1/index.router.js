import express from 'express';
import pingRouter from './ping.router.js';
import userRouter from './user.js';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/user', userRouter);

export default v1Router;


