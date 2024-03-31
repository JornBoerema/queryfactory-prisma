import { Router } from "express";
import { checkSchema } from "express-validator";

import { register } from "../controllers/auth/register";
import { login } from "../controllers/auth/login";
import { token } from "../controllers/auth/token";
import { forgotPassword } from "../controllers/auth/forgot-password";
import { verifyEmail } from "../controllers/auth/verify-email";
import { resetPassword } from "../controllers/auth/reset-password";

import { RegisterSchema } from "../schemas/auth/register-schema";
import { LoginSchema } from "../schemas/auth/login-schema";
import { TokenSchema } from "../schemas/auth/token-schema";
import { ForgotPasswordSchema } from "../schemas/auth/forgot-password-schema";
import { VerifyEmailSchema } from "../schemas/auth/verify-email-schema";
import { ResetPasswordSchema } from "../schemas/auth/reset-password-schema";

export default (router: Router) => {
	router.post("/register", checkSchema(RegisterSchema), register);
	router.post("/login", checkSchema(LoginSchema), login);
	router.post("/token", checkSchema(TokenSchema), token);
	router.post("/verify-email", checkSchema(VerifyEmailSchema), verifyEmail);
	router.post("/forgot-password", checkSchema(ForgotPasswordSchema), forgotPassword);
	router.post("/reset-password", checkSchema(ResetPasswordSchema), resetPassword);
};
