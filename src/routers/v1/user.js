import express from 'express';
import { usersignInSchema, userSignUpSchema } from '../../validators/userSchema.js';
import { validateRequestBody } from '../../validators/index.js';
import { signIn, signUp } from '../../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/signup", validateRequestBody(userSignUpSchema), signUp);
userRouter.post("/signin", validateRequestBody(usersignInSchema), signIn);

export default userRouter;