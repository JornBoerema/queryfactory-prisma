import express from "express";

import users from "./routes/users";
import auth from "./routes/auth";
import teams from "./routes/teams";

const router = express.Router();

export default () => {
	users(router);
	auth(router);
	teams(router);

	return router;
};
