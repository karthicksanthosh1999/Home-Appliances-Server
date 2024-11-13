import mongoose, { Document, model, ObjectId, Schema } from 'mongoose';

export interface ICustomer extends Document {
    _id: ObjectId,
    date?: Date,
    customerName: string,
    customerId?: string,
    branch: ObjectId,
    mobile: string,
    email: string,
    address: string,
    knownVia: string,
    feedBack: string,
    customerStatus: "Customer" | "Lead"
}

const customerSchema: Schema = new Schema<ICustomer>({
    date: {
        type: Date,
        trim: true,
        required: [true, "Date is required"]
    },
    customerName: {
        type: String,
        trim: true,
        required: [true, "Employee id is required"]
    },
    customerId: {
        type: String,
        trim: true,
        required: [true, "customerId is required"]
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
        required: [true, "Email is required"]
    },
    customerStatus: {
        type: String,
        enum: ['Customer', "Lead"],
        default: "Customer"
    },
    address: {
        type: String,
        trim: true,
        required: [true, "Address Id is required"]
    },
    knownVia: {
        type: String,
        trim: true,
        required: [true, "Lead Source Id is required"]
    },
    feedBack: {
        type: String,
        trim: true,
        required: [true, "Feed Back is required"]
    }
}, {
    timestamps: true
})

export const CUSTOMERMODAL = model<ICustomer>("Customers", customerSchema);