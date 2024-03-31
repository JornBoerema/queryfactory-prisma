import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import { db } from "../lib/prisma";

export const generateAccessToken = (userId: string) => {
	return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
	return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!);
};

export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 Hour

	const existingToken = await db.passwordResetToken.findFirst({ where: { email } });

	if (existingToken) {
		await db.passwordResetToken.delete({
			where: { id: existingToken.id },
		});
	}

	return await db.passwordResetToken.create({
		data: {
			email,
			token,
			expires,
		},
	});
};

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 Hour

	const existingToken = await db.verificationToken.findFirst({ where: { email } });

	if (existingToken) {
		await db.verificationToken.delete({
			where: { id: existingToken.id },
		});
	}

	return await db.verificationToken.create({
		data: {
			email,
			token,
			expires,
		},
	});
};
