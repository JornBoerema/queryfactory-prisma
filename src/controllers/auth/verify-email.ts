import express from "express";
import { db } from "../../lib/prisma";
import { matchedData, validationResult } from "express-validator";

interface VerifyEmailBodyType {
	token: string;
}

export const verifyEmail = async (req: express.Request, res: express.Response) => {
	// Validate the request body
	const result = validationResult(req);

	if (!result.isEmpty()) return res.status(400).send(result.array());

	const { token } = matchedData(req) as VerifyEmailBodyType;

	// Check if the token exist
	const existingToken = await db.verificationToken.findUnique({ where: { token } });

	if (!existingToken) {
		return res.status(404).json({ success: false, message: "Token does not exist" });
	}

	// Check if the token is expired
	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return res.status(401).json({ success: false, message: "Token has expired" });
	}

	// Check if there is a user with the email address from the token
	const existingUser = await db.user.findUnique({ where: { email: existingToken.email } });

	if (!existingUser) {
		return res.status(404).json({ success: false, message: "User does not exist" });
	}

	// Update the emailVerified field of the user
	await db.user.update({
		where: { id: existingUser.id },
		data: {
			emailVerified: new Date(),
			email: existingToken.email,
		},
	});

	// Delete the verification token
	await db.verificationToken.delete({
		where: { id: existingToken.id },
	});

	return res.status(200).json({ success: true, message: "Email verified" });
};
