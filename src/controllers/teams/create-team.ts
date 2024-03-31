import express from "express";
import { matchedData, validationResult } from "express-validator";
import { db } from "../../lib/prisma";

interface CreateTeamBodyType {
	name: string;
}

export const createTeam = async (req: express.Request, res: express.Response) => {
	// Validate the request body
	const result = validationResult(req);

	if (!result.isEmpty()) return res.status(400).send(result.array());

	const { name } = matchedData(req) as CreateTeamBodyType;

	const user = req.user;

	if (!user) {
		return res.status(200).json({ success: false, message: "Cannot find user" });
	}

	const slug = name.toLowerCase().replaceAll(" ", "_");

	await db.team.create({ data: { name, slug, teamMembers: { create: { userId: user?.id, role: "OWNER" } } } });

	return res.sendStatus(201);
};
