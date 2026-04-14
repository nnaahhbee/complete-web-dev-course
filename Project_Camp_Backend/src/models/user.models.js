import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new Schema({
   avatar: {
    type: {
        url: String,
        localPath: String,
    },
    default: {
        url: `https://placehold.co/200x200`,
        localPath: ""
    }
   },
   username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
   },
   email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
   },
   fullName: {
    type: String,
    trim: true,
   },
   password: {
    type: String,
    required: [true, "Password is reuired"]
   },
   isEmailVerified: {
    type: Boolean,
    default: false
   },
   refreshToken: {
    type: String,
   },
   forgotPasswordToken: {
    type: String,
   },
   forgotPasswordTokenExpiry: {
    type: Date,
   },
   emailVerificationToken: {
    type: String,
   },
   emailVerificationTokenExpiry: {
    type: Date,
   },
},
  {
    timestamps: true,
  }
);

//hook to hash password before saving user
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
};


//generate token with data
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        //payload
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        //secret
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
};


// crypto module - generate token without data
userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

    const tokenExpiry = Date.now() + (20*60*1000); //20 minutes

    return {unHashedToken, hashedToken, tokenExpiry
    }
};


export const User = mongoose.model("User", userSchema);