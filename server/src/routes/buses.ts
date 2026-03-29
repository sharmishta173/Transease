import { Router } from "express";
import { getBuses, getBusById } from "../controllers/busController";

const router = Router();

router.get("/", getBuses);
router.get("/:busId", getBusById);

export default router;