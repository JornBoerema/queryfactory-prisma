import { Router } from "express";
import { getUsers } from "../controllers/users/get-users";
import { requireAdmin } from "../middleware/require-admin";

export default (router: Router) => {
	router.get("/users", requireAdmin, getUsers);
};
