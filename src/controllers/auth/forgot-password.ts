import express from "express";
import { matchedData, validationResult } from "express-validator";
import { db } from "../../lib/prisma";
import { generatePasswordResetToken } from "../../utils/tokens";
import { sendForgotPasswordEmail } from "../../lib/email";

interface ForgotPasswordBodyType {
	email: string;
}

export const forgotPassword = async (req: express.Request, res: express.Response) => {
	// Validate the request body
	const result = validationResult(req);

	if (!result.isEmpty()) return res.status(400).send(result.array());

	const { email } = matchedData(req) as ForgotPasswordBodyType;

	const existingUser = await db.user.findUnique({ where: { email } });

	if (!existingUser) {
		return res.status(404).json({ success: false, message: "User not found" });
	}

	const passwordResetToken = await generatePasswordResetToken(email);
	await sendForgotPasswordEmail(passwordResetToken.email, passwordResetToken.token);

	return res.status(200).json({ success: true, message: "Forgot password email sent" });
};
