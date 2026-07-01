import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js';
import {User} from '../models/user.models.js';
import {deleteFromCloudinary, uploadToCloudinary} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';


//helper method
const generateAccessAndResfreshToken = async(userId) => {
 try {
    const user = User.findById(userId)
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


const loginUser = asyncHandler(async (req, res) => {
    //get data from body
    const {email, username, password} = req.body

    //validation
    if(!email){
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
    .select("-password, -refreshToken"); //return the object without the password and refreshToken field

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


export {
    registerUser,
    loginUser,
    refreshAccessToken
}