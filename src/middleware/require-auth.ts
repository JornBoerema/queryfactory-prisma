import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../lib/prisma";

export const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const authHeader = req.headers.authorization ?? "";
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) return res.sendStatus(401);

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, async (err, user) => {
			if (err) return res.sendStatus(403);

			const parsedUser = user as { id: string; iat: number };

			req.user = await db.user.findUnique({ where: { id: parsedUser.id } });

			next();
		});
	} catch (err) {
		return res.sendStatus(403);
	}
};
