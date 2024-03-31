import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { User } from "@prisma/client";

import routes from "./routes";

const app = express();

type QueryFactoryAuthProp = { user: User | null };

declare global {
	namespace Express {
		interface Request extends QueryFactoryAuthProp {}
	}
}

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/", routes());

app.get("*", (req, res) => {
	res.status(404).json({ success: false, message: "Resource not found." });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}/`);
});
