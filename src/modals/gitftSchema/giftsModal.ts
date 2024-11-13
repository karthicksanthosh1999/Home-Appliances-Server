import { IGiftSchema } from "../../@types/giftTypes";
import { Schema, model, } from "mongoose";

const giftSchema: Schema = new Schema<IGiftSchema>({
    giftName: {
        type: String,
        required: [true, "Gift name is required"]
    },
    giftType: {
        type: String,
        enum: ['Discount', 'Product', 'Service'],
        required: [true, "Gift type is required"]
    },
    giftValue: {
        type: Number,
        required: [true, "Gift value is required"],
        default: 0
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    },
    createdPerson: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Created person is required"]
    }
}, {
    timestamps: true
})

export const GIFTMODAL = model<IGiftSchema>("Gift", giftSchema)