import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectMember.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from '../utils/api_errors.js';


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
    //test
});


// method for updating a project
const updateproject = asyncHandler(async (req, res) => {
    //test
});


//method for deleting a project
const deleteProject = asyncHandler(async (req, res) => {
    //test
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