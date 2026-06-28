import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js';
import {User} from '../models/user.models.js';
import {deleteFromCloudinary, uploadToCloudinary} from '../utils/cloudinary.js'
import {apiResponse} from '../utils/apiResponse.js'


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




export {
    registerUser
}