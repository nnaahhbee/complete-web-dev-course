import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {Task} from '../models/task.models.js';
import {Subtask} from '../models/subtask.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from '../utils/api_errors.js';
import mongoose from 'mongoose';
import { UserRolesEnum } from '../utils/constants.js';
import { AvailableUserRole } from '../utils/constants.js';



const getTasks = asyncHandler(async (req, res) => {
    //test
});


const createTask = asyncHandler(async (req, res) => {
    //test
});


const getTaskById = asyncHandler(async (req, res) => {
    //test
});


const updateTask = asyncHandler(async (req, res) => {
    //test
});


const deleteTask = asyncHandler(async (req, res) => {
    //test
});

const createSubTask = asyncHandler(async (req, res) => {
    //test
});


const updateSubTask = asyncHandler(async (req, res) => {
    //test
});


const deleteSubTask = asyncHandler(async (req, res) => {
    //test
});

export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask 
}


 
