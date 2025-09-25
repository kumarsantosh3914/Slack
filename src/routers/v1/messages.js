import express from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { getMessages } from "../../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/messages/:channelId", isAuthenticated, getMessages);

export default messageRouter;
