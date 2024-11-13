import mongoose, { Document, model, Schema } from 'mongoose';

export interface ILead extends Document {
    _id: string,
    date: Date,
    customerName: string,
    mobile: string,
    email: string,
    leadId: string,
    address: string,
    knownVia: string,
    updatedOn: Date,
    remainder: Date,
    status: string,
    suggestion: string,
    branch: mongoose.Schema.Types.ObjectId,
}

const leadSchema: Schema = new Schema<ILead>({
    date: {
        type: Date,
        trim: true,
        required: [true, "Date is required"]
    },
    updatedOn: {
        type: Date,
        trim: true
    },
    customerName: {
        type: String,
        trim: true,
        required: [true, "Customer Nmae id is required"]
    },
    status: {
        type: String,
        trim: true,
        required: [true, "Status id is required"]
    },
    suggestion: {
        type: String,
        trim: true,
        required: [true, "Suggestion id is required"]
    },
    leadId: {
        type: String,
        trim: true
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
    address: {
        type: String,
        trim: true,
        required: [true, "Address Id is required"]
    },
    knownVia: {
        type: String,
        trim: true,
        required: [true, "knownVia Id is required"]
    },
    remainder: {
        type: Date,
        trim: true,
        required: [true, "remainder Id is required"]
    }
}, {
    timestamps: true
})

export const LEADMODAL = model<ILead>("Leads", leadSchema);