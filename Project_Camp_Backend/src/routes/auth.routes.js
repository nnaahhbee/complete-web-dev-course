import { Router } from "express";
import { registerUser, login, logoutUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js"; 
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

//route for registering a user
router.route("/register").post(userRegisterValidator(), validate,
registerUser);
router.route("/login").post
(userLoginValidator(), validate, login); 

//secure route for logging out the user
router.route("/logout").post(verifyJWT, logoutUser);


export default router;