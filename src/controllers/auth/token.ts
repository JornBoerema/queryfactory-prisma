import express from "express";
import { matchedData, validationResult } from "express-validator";
import { db } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/tokens";

interface TokenBodyType {
	token: string;
}

export const token = async (req: express.Request, res: express.Response) => {
	try {
		// Validate the request body
		const result = validationResult(req);

		if (!result.isEmpty()) return res.status(400).send(result.array());

		const { token } = matchedData(req) as TokenBodyType;

		// Check if there is a user with this refresh token, else return an 403 error
		const user = db.user.findFirst({ where: { refreshToken: token } });

		if (!user) {
			return res.sendStatus(403);
		}

		// Verify the refresh token and return the new access token
		jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}

			const parsedUser = user as { id: string; iat: number };

			const access_token = generateAccessToken(parsedUser.id);
			return res.status(200).json({ access_token });
		});
	} catch (err) {
		return res.status(400).json(err);
	}
};
