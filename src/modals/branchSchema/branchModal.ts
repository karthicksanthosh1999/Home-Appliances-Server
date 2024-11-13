import mongoose, { Document, Schema } from "mongoose";

export interface IBranch extends Document {
    _id: string,
    branchName: string,
    managerId: string,
    street: string,
    city: string,
    state: string,
    country: string,
    branchId?: string
}

const branchSchema: Schema = new Schema<IBranch>({
    branchName: {
        type: String,
        trim: true,
        required: [true, "Branch name is required"]
    },
    managerId: {
        type: String,
        trim: true,
        required: [true, "Employee id is required"]
    },
    street: {
        type: String,
        trim: true,
        required: [true, "Street is required"]
    },
    city: {
        type: String,
        trim: true,
        required: [true, "City is required"]
    },
    state: {
        type: String,
        trim: true,
        required: [true, "State is required"]
    },
    country: {
        type: String,
        trim: true,
        required: [true, "Country is required"]
    },
    branchId: {
        type: String,
        trim: true,
        required: [true, "Branch Id is required"]
    }
}, {
    timestamps: true
})

export const BRANCHMODAL = mongoose.model<IBranch>('Branch', branchSchema)