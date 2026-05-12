import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectMember.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from '../utils/api_errors.js';
import mongoose from 'mongoose';


//method to get the list of user project
const getProjects = asyncHandler(async (req, res) => {
    //test
});


//method to get project details
const getProjectsById = asyncHandler(async (req, res) => {
    //test
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
    //test
});


// method to get project members
const getProjectMembers = asyncHandler(async (req, res) => {
    //test
});


// method for updating member role
const updateMemberRole = asyncHandler(async (req, res) => {
    //test
});


// method for deleting a member
const deleteMember = asyncHandler(async (req, res) => {
    //test
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