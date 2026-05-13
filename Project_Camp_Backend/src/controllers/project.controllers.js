import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectMember.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from '../utils/api_errors.js';
import mongoose from 'mongoose';
import { UserRolesEnum } from '../utils/constants.js';
import { AvailableUserRole } from '../utils/constants.js';


//method to get the list of user project
const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
        
        //aggregation match for getting the projects of the user
      {
        $match: {
            user: new mongoose.Types.ObjectId(req.user._id),
        },
      },

      //aggregation for getting the project details and the number of members in each project
      {
        $lookup: {
            from: "projects",
            localField: "projects",
            foreignField: "_id",
            as: "projects",
            pipeline: [
                {
                    $lookup: {
                        from: "projectmembers",
                        localField: "_id",
                        foreignField: "projects",
                        as: "projectmembers",
                    },
                },
                {
                    $addFields: {
                        members: {
                            $size: "$projectmembers"
                        },
                    },
                },
            ]

        },
      },

      //aggregation for unwinding the project array
      {
        $unwind: "$projects"
      },

      //aggregation for projecting the required fields
      {
        $projects: {
            project: {
                _id: 1,
                name: 1, 
                description: 1,
                members: 1,
                createdAt: 1,
                createdBy: 1,
            },
            role: 1,
            _id: 0,
        },
      },
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            projects,
            "Projects fetched successfully"
        )
    )
});


//method to get project details
const getProjectsById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project details fetched successfully"
        )
    );
    
});


// method for creating a project
const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body; 

    await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id), //for mongoose id
    });

    //the creator of the project
    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN
    });

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            project,
            "Project created successfully"
        )
    )
});


// method for updating a project
const updateproject = asyncHandler(async (req, res) => {
    const { name, description } = req.body; 
    const { projectId } = req.params;

   const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        { new: true }
    );

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project updated successfully"
        )
    )
});


//method for deleting a project
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project deleted successfully"
        )
    )
});


// method for adding project member
const addMembersToProject = asyncHandler(async (req, res) => {
    const { email, role} = req.body;
    const { projectId } = req.params;

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User not found");
    }

    //finding a user and update its role
    await ProjectMember.findByIdAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role,
        },
        {
            new: true, //return the updated document
            upsert: true, //create a new document if it doesn't exist
        }
    );

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {},
            "Member added to project successfully"
        )
    )
});


// method to get project members
const getProjectMembers = asyncHandler(async (req, res) => {
    //getting the project id from the request parameters
    const {projectId} = req.params;
    const project = await Project.findById(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }


    //aggregation for getting the project members and their details
    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
            },         
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ]
            },
        },
        {
          $addFields: {
            user: {
                $arrayElemAt: ["$user", 0]
            },
          },  
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            },
        },
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            projectMembers,
            "Project members fetched successfully"
        )
    );
});


// method for updating member role
const updateMemberRole = asyncHandler(async (req, res) => {

    //getting the project id and user id from the request parameters and the new role from the request body
    const {projectId, userId} = req.params;
    const {newRole} = req.body;

    //checking if the new role is valid
    if(!AvailableUserRole.includes(newRole)){
        throw new ApiError(400, "Invalid role");
    }

    //finding the project member
    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId), 
    })

    if(!projectMember){
        throw new ApiError(400, "Project member not found");
    }

    //updating the project member role
   projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role: newRole,
        },
        {new: true}
    )

    if(!projectMember){
        throw new ApiError(400, "Project member not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            projectMember,
            "Project member role updated successfully"
        )
    );
});


// method for deleting a member
const deleteMember = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params;


    //finding the project member
    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId), 
    })

    if(!projectMember){
        throw new ApiError(400, "Project member not found");
    }

    //deleting the project member
   projectMember = await ProjectMember.findByIdAndDelete(projectMember._id,)

    if(!projectMember){
        throw new ApiError(400, "Project member not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            projectMember,
            "Project member role deleted successfully"
        )
    );
});

export{
    getProjects,
    getProjectsById,
    createProject,
    updateproject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
}