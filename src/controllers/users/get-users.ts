import { Request, Response } from "express";
import { db } from "../../lib/prisma";

export const getUsers = async (req: Request, res: Response) => {
	// console.log(req.user);

	const users = await db.user.findMany({
		select: { id: true, firstName: true, lastName: true, email: true, emailVerified: true, role: true },
	});

	return res.status(200).json({ success: true, result: users });
};
