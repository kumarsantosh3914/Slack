import { z } from 'zod';

export const userSignUpSchema = z.object({
    email: z.string().email(),
    username: z.string().min(2),
    password: z.string()
});

export const usersignInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});