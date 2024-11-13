import mongoose, { Document, model, ObjectId, Schema } from 'mongoose';

export interface IProduct extends Document {
    _id: string,
    date: Date,
    productName: string,
    productId: string,
    brand: string,
    branch: ObjectId,
    category: string,
    dealerName: string,
    mrp: string,
    count: number,
}

const productSchema: Schema = new Schema<IProduct>({
    date: {
        type: Date,
        trim: true,
        required: [true, "Branch name is required"]
    },
    productName: {
        type: String,
        trim: true,
        required: [true, "Employee id is required"]
    },
    productId: {
        type: String,
        trim: true,
        required: [true, "Street is required"]
    },
    brand: {
        type: String,
        trim: true,
        required: [true, "Street is required"]
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },
    category: {
        type: String,
        trim: true,
        required: [true, "State is required"]
    },
    dealerName: {
        type: String,
        trim: true,
        required: [true, "Country is required"]
    },
    mrp: {
        type: String,
        trim: true,
        required: [true, "Branch Id is required"]
    },
    count: {
        type: Number,
        trim: true,
        required: [true, "Branch Id is required"]
    }
}, {
    timestamps: true
})

export const PRODUCTMODAL = model<IProduct>("Products", productSchema);