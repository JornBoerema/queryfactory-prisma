import express from "express";
import { matchedData, validationResult } from "express-validator";
import { db } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, generateVerificationToken } from "../../utils/tokens";
import { sendVerificationEmail } from "../../lib/email";

interface LoginBodyType {
	email: string;
	password: string;
}

export const login = async (req: express.Request, res: express.Response) => {
	// Validate the request body
	const result = validationResult(req);

	if (!result.isEmpty()) return res.status(400).send(result.array());

	const { email, password } = matchedData(req) as LoginBodyType;

	// If the user does not exist, return an 401 error
	const existingUser = await db.user.findUnique({ where: { email } });

	if (!existingUser) {
		return res.status(401).json({ success: false, message: "No user found with that email" });
	}

	// If the password does not match the users password, return an 401 error
	const passwordMatch = await bcrypt.compare(password, existingUser.password);

	if (!passwordMatch) {
		return res.status(401).json({ success: false, message: "Invalid password" });
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email);
		await sendVerificationEmail(verificationToken.email, verificationToken.token);

		return res.status(200).json({ success: false, message: "Confirmation email sent" });
	}

	// Generate the tokens
	const access_token = generateAccessToken(existingUser.id);
	const refresh_token = generateRefreshToken(existingUser.id);

	// Update the user refresh token in the database
	await db.user.update({ data: { refreshToken: refresh_token }, where: { id: existingUser.id } });

	// Return the tokens to the client
	return res.status(200).json({ access_token, refresh_token });
};
