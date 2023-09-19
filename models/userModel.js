import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name : {type: String, required: true},
        email : {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false, required: true},
    },
    {
        timestamps: true // to keep record when schema was last updated etc
    } //gives createdAt and updatedAt time
); //accepts ans object which defines the fields of the schema

const User = mongoose.model('User', userSchema);

export default User;