import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js';
import {User} from '../models/user.models.js';
import {deleteFromCloudinary, uploadToCloudinary} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

//helper method
const generateAccessAndResfreshToken = async(userId) => {
 try {
    const user = await User.findById(userId)
    if(!user){
       throw new apiError(400, "User not found");
    }
   
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
   
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
 } catch (error) {
    throw new apiError(500, "Something went wrong while generating access and refresh tokoens")   
 }
}

//register user
const registerUser = asyncHandler (async (req, res) => {
    //accept data from the user
    const {fullname, email, username, password} = req.body

    //validation
    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400, "All fields are required");
    }

    //check for existing user
   const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new apiError(400, "User with email or username already exist");
    }

    //handling files with multer
    const avatarLocalPath = req.files?.avatar?.[0]?.path// multer will store it
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is missing");   
    }

    //upload to cloudinary using the method created for uploading files
    // const avatar = await uploadToCloudinary(avatarLocalPath);
    // let coverImage = "";
    // if(coverLocalPath){
    //     coverImage = await uploadToCloudinary(coverImage)
    // }


    //handling the avatar image
    let avatar;
    try{
       avatar = await uploadToCloudinary(avatarLocalPath)
       console.log("Uploaded avatar", avatar)

    }catch(error){
        console.log("Error uploading avatar", error)
        throw new apiError(500, "Failed to upload avatar");
    }


    //handling the cover image
    let coverImage;
    try{
       coverImage = await uploadToCloudinary(coverLocalPath)
       console.log("Uploaded cover image", coverImage)

    }catch(error){
        console.log("Error uploading avatar", error)
        throw new apiError(500, "Failed to upload cover image");
    }

    //save the user in monggodb
    try {
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
         })
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken" //remove some feild
        )
    
        if(!createdUser){
             throw new apiError(500, "Something went wrong while registering the user");
        }
    
        return res
        .status(201)
        .json(new apiResponse(200, createdUser, "User registered successfully"))
    } catch (error) {
        console.log("User creation failed")

        if(avatar){
            await deleteFromCloudinary(avatar.public_id)
        }
        if(coverImage){
            await deleteFromCloudinary(coverImage.public_id)
        }  

        throw new apiError(500, "Something went wrong while registering the user and Imges were deleted");
    }

});

//login user
const loginUser = asyncHandler(async (req, res) => {
    //get data from body
    const {email, username, password} = req.body

    //validation
    if(!username && !email){
        throw new apiError(400, "Email is required")
    }

    //check for existing user based either on username or email
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(400, "User not found")
    }

    //validate password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(400, "Invalid credentials")
    }

    const {accessToken, refreshToken} = await
    generateAccessAndResfreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken"); //return the object without the password and refreshToken field

    if(!loggedInUser){
        throw new apiError(500, "Log in failed")
    }

    const options = {
        httpOnly: true, //make the cookie non modifiable to client side
        secure: process.env.NODE_ENV === "production",
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(
        200, 
        {user: loggedInUser, accessToken, refreshToken}, 
        "User logged in successfully"))
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"))
           
});

//refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Refresh token is required")
    }

    //verify the incoming refresh token
    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new apiError(401, "Invalid refresh token")
        }

        //check if the incoming refresh token matches the one stored in the database
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        //generate new access token and refresh token
        const {accessToken, refreshToken: newRefreshToken} =
        await generateAccessAndResfreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new apiResponse(
            200, {accessToken, refreshToken: newRefreshToken}, 
            "Access token refreshed successfully"
        ))

    }catch(error){
        throw new apiError(500, "Something went wrong while refreshing access token")

    }
});


//change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: true})

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"))
});


//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
    .json(new apiResponse(200, req.user, "Current user fetched successfully"))
    
}); 

//update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    //get the data from the request body
    const {fullname, email} = req.body

    //validation
    if(!fullname || !email){
        throw new apiError(400, "Full name and email are required") 
    }

    //find by id and update the user
    const user = await User.findByIdAndUpdate(
        req.user._id, //update the user with the id of the logged in user

        //update the fullname and email fields
        {
            $set: {
                fullname,
                email: email
            } 
        },
        {new: true}
    ).select("-password") //return the updated user without the password field

    return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))  
});

//update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    // access the local path of the uploaded avatar file
    const avatarLocalPath = req.file?.path 

    // validate - check if the avatar file is present
    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is missing");
    }

    const currentUser = await User.findById(req.user?._id).select("avatar");
    const oldAvatarUrl = currentUser?.avatar;

    //upload the avatar to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath)

    // validate - check if the avatar was uploaded successfully
    if(!avatar?.url){
        throw new apiError(500, "Error while uploading avatar");
    }

    //update the user's avatar field in the database
   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password -refreshToken");

    if(oldAvatarUrl && oldAvatarUrl !== avatar.url){
        const oldAvatarPublicId = oldAvatarUrl.split('/').pop()?.split('.')[0];
        if(oldAvatarPublicId && oldAvatarPublicId !== avatar.public_id){
            await deleteFromCloudinary(oldAvatarPublicId);
        }
    }

    return res.status(200)
    .json(new apiResponse(200, user, "Avatar updated successfully"));
    
});

//update user cover image
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new apiError(400, "Cover image file is missing")
    }

    const currentUser = await User.findById(req.user?._id).select("coverImage");
    const oldCoverImageUrl = currentUser?.coverImage;

    //upload the avatar to cloudinary
    const coverImage = await uploadToCloudinary(coverImageLocalPath)


    if(!coverImage?.url){
        throw new apiError(500, "Error while uploading cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password -refreshToken");

    if(oldCoverImageUrl && oldCoverImageUrl !== coverImage.url){
        const oldCoverImagePublicId = oldCoverImageUrl.split('/').pop()?.split('.')[0];
        if(oldCoverImagePublicId && oldCoverImagePublicId !== coverImage.public_id){
            await deleteFromCloudinary(oldCoverImagePublicId);
        }
    }

    return res.status(200)
    .json(new apiResponse(200, user, "Cover image updated successfully"))
});

//get user channel profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
    //grab info from url to determine which user to fetch
    const { username } = req.params

    //validation 
    if(!username?.trim()){
        throw new apiError(400, "Username is required")
    }

    //grab channel info
    const channel = await User.aggregate(
        [  //get the user with the given username
            {
                $match: {
                    username: username?.toLowerCase()
                },
            },
            //lookup the subscribers of the channel
            {
                $lookup: {
                    from: "subscriptions", //collection name in mongodb
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            //collect all the channel's a subscribers have subscribed to
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribeTo"
                }

            },
            //count the number of subscribers and channels subscribed to
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribeTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: {
                                $in: [req.user?._id, "$subscribers.subscriber"]
                            },
                            then: true,
                            else: false
                        },
                    }
                }
            },
            //project only the necessary data - what we want to return to the client
            {
                $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    email: 1,
                }
            },
        ]
    )

    //check if the channel exists 
    if(!channel?.length){
    throw new apiError(404, "Channel not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200, channel[0], "Channel profile fetched successfully"))

});

//get watch history of the logged in user
const getWatchHistory = asyncHandler(async (req, res) => {
    //get the watch history of the logged in user
    const user = await User.aggregate([
        //match the user by id
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            },
        },
        //lookup the videos in the watch history
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                //lookup the owner of each video in the watch history
                pipeline: [ 
                {
                    $lookup: { 
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        //project only the necessary fields from the owner object
                        pipeline: [{
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                            },
                        }]
                    },
                },
                {
                //add the owner field to the video object
                $addFields: {
                    owner: {
                        $first: "$owner"
                    }
                }
                }
            ]
            },
        }
    ]);

    return res
    .status(200)
    .json(new apiResponse(200, user[0]?.watchHistory, "Watch history fetched successfully"))

});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}