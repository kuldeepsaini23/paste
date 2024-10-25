import { Router } from "express";
import authRoute from "./user.routes.js";
import pasteRoute from "./paste.routes.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/pastes", pasteRoute);


export default router;