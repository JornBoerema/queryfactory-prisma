import express from "express";
import bcrypt from "bcryptjs";
import { matchedData, validationResult } from "express-validator";

import { db } from "../../lib/prisma";

interface ResetPasswordBodyType {
	password: string;
	token: string;
}

export const resetPassword = async (req: express.Request, res: express.Response) => {
	// Validate the request body
	const result = validationResult(req);

	if (!result.isEmpty()) return res.status(400).send(result.array());

	const { password, token } = matchedData(req) as ResetPasswordBodyType;

	if (!token) {
		return res.status(400).json({ success: false, message: "Missing token" });
	}

	const existingToken = await db.passwordResetToken.findUnique({ where: { token } });

	if (!existingToken) {
		return res.status(401).json({ success: false, message: "Invalid token" });
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return res.status(401).json({ success: false, message: "Token has expired" });
	}

	const existingUser = await db.user.findUnique({ where: { email: existingToken.email } });

	if (!existingUser) {
		return res.status(404).json({ success: false, message: "User does not exist" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	await db.passwordResetToken.delete({ where: { id: existingToken.id } });

	return res.status(200).json({ success: true, message: "Password updated" });
};
