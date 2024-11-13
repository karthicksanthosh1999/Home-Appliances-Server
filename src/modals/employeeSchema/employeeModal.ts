import mongoose, { Document, model, Schema } from 'mongoose';

export interface IEmployee extends Document {
    _id: string,
    employeeName: string,
    employeeId: string,
    branch: mongoose.Schema.Types.ObjectId,
    mobile: string,
    email: string,
    address: string,
    dob: Date,
    doj: Date,
    salary: number,
    idProof: string,
}

const employeeSchema: Schema = new Schema<IEmployee>({
    employeeName: {
        type: String,
        trim: true,
        required: [true, "Employee Name is required"]
    },
    employeeId: {
        type: String,
        trim: true,
        required: [true, "Employee ID is required"]
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },
    mobile: {
        type: String,
        trim: true,
        required: [true, "Mobile is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Eamil is required"]
    },
    address: {
        type: String,
        trim: true,
        required: [true, "Address Id is required"]
    },
    salary: {
        type: Number,
        trim: true,
        required: [true, "Salary is required"]
    },
    dob: {
        type: Date,
        trim: true,
        required: [true, "DOB Id is required"]
    },
    doj: {
        type: Date,
        trim: true,
        required: [true, "DOJ Id is required"]
    },
    idProof: {
        type: String,
        trim: true,
        required: [true, "ID proof is required"]
    }
}, {
    timestamps: true
})

export const EMPLOYEEMODAL = model<IEmployee>("Employee", employeeSchema);