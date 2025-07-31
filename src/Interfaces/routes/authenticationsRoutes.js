import { Router } from "express";
import authenticationsController from "../controllers/authenticationsController.js";

// injecting dependencies
const authenticationsRoutes = (container) => {
    const router = Router();
    const authController = new authenticationsController(container);
    
    router.post('/auth/login', authController.postLoginUser);
    
    return router;
}

export default authenticationsRoutes;