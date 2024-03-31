import express from "express";
import bcrypt from "bcryptjs";
import { matchedData, validationResult } from "express-validator";
import { db } from "../../lib/prisma";
import { generateVerificationToken } from "../../utils/tokens";
import { sendVerificationEmail } from "../../lib/email";

interface RegisterBodyType {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export const register = async (req: express.Request, res: express.Response) => {
	// Validate the request body
	const result = validationResult(req);

	if (!result.isEmpty()) return res.status(400).send(result.array());

	const { firstName, lastName, email, password } = matchedData(req) as RegisterBodyType;

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// If the there already is a user with this email, return an error
	const existingUser = await db.user.findUnique({ where: { email } });

	if (existingUser) {
		return res.status(400).json({ success: false, message: "Email already in use" });
	}

	// Create the user in the database
	await db.user.create({
		data: {
			firstName,
			lastName,
			email,
			password: hashedPassword,
		},
	});

	// Send email verification email
	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(verificationToken.email, verificationToken.token);

	return res.sendStatus(200);
};
