import { Router } from "express";
import { getProjects, getProjectsById, createProject, updateProject, deleteProject, addMembersToProject, getProjectMembers, updateMemberRole, deleteMember } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator, addMemberToProjectValidator} from "../validators/index.js"; 
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";


const router = Router();
router.use(verifyJWT);// Apply JWT verification middleware to all routes

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject);


router
    .route("/:projectId") 
    .get(validateProjectPermission(AvailableUserRole), getProjectsById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), createProjectValidator(), validate, updateProject
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject
    );

router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMembersToProject
    );

router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember);
    
    
export default router;