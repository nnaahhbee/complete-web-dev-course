import mongoose, {Schema} from 'mongoose';

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video", // Reference to the Video model
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment", // Reference to the Comment model
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet", // Reference to the Tweet model
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
        },
    },
    {timestamps: trye}
);

export const Like = mongoose.model("Like", likeSchema);