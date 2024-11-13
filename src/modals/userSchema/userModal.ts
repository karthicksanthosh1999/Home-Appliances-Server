import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    userType: string;
    password: string;
    profile: string;
    address: string;
    dob: Date,
    doj: Date,
    gender: string,
    salary: number,
    branch: ObjectId,
    isValidEmail: boolean,
    isValidMobile: boolean,
    verificationToken?: string
}

const UserSchema: Schema = new Schema<IUser>({
    firstName: {
        type: String,
        trim: true,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Last name is required"]
    },
    mobile: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Mobile is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    userType: {
        type: String,
        trim: true,
        enum: ["Admin", "Manager", "Employee", "Delivery"],
        required: [true, "User type is required"],
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        unique: true
    },
    profile: {
        type: String,
        trim: true,
        required: [true, "Profile is required"]
    },
    doj: {
        type: Date,
        required: [true, "Doj is required"]
    },
    dob: {
        type: Date,
        required: [true, "Dob is required"]
    },
    salary: {
        type: Number,
        trim: true,
        required: [true, "Salary is required"]
    },
    address: {
        type: String,
        trim: true,
        required: [true, "Address is required"]
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: [true, "Branch is required!"]
    },
    isValidEmail: {
        type: Boolean,
        default: false
    },
    isValidMobile: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

export const USERMODAL = mongoose.model<IUser>("User", UserSchema)