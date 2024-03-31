import { Router } from "express";
import { requireAuth } from "../middleware/require-auth";
import { createTeam } from "../controllers/teams/create-team";
import { checkSchema } from "express-validator";
import { CreateTeamSchema } from "../schemas/teams/create-team-schema";

export default (router: Router) => {
	router.post("/teams", requireAuth, checkSchema(CreateTeamSchema), createTeam);
};
