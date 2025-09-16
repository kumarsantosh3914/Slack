import { signUpService, signInService } from '../services/userService.js';

export const signUp = async (req, res) => {
    const response = await signUpService(req.body);

    res.status(201).json({
        message: "User created successfully",
        data: response,
        success: true,
    });
}

export const signIn = async (req, res) => {
    const response = await signInService(req.body);

    res.status(200).json({
        message: "User signed in successfully",
        data: response,
        success: true,
    });
}