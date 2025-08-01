import { Router } from "express";
import authenticationsController from "../controllers/authenticationsController.js";

// injecting dependencies
const authenticationsRoutes = (container) => {
    const router = Router();
    const authController = new authenticationsController(container);
    
    router.post('/authentications', authController.postAuthenticationHandler);
    router.put('/authentications', authController.putAuthenticationHandler);
    
    return router;
}

export default authenticationsRoutes;