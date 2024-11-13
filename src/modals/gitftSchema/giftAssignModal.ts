import mongoose, { model, Schema } from "mongoose";
import { IGiftAssignmentSchema } from "../../@types/giftTypes";

const giftAssignSchema: Schema = new Schema<IGiftAssignmentSchema>({
    gifttId: {
        type: mongoose.Types.ObjectId,
        ref: "Gift",
        required: [true, "Gift name is required"],
    },
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: "Customers",
        required: [true, "Cusotmer id is required"],
    },
    invoiceId: {
        type: mongoose.Types.ObjectId,
        ref: "Invoices",
        required: [true, "Invoice id is required"],
    },
    branchId: {
        type: mongoose.Types.ObjectId,
        ref: "Branch",
        required: [true, "Branch is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    value: {
        type: Number,
        required: [true, "Value is required"],
    },
    assignedDate: {
        type: Date,
        required: [true, "Assigned data is requied"]
    }
}, {
    timestamps: true
})

export const GIFTASSIGNMODAL = model<IGiftAssignmentSchema>("GiftAssignment", giftAssignSchema)