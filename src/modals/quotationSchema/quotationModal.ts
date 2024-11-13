import mongoose, { Document, model, ObjectId, Schema } from "mongoose";


export interface IQuotation extends Document {
    customerDetails: {
        customerName: string,
        mobile: string,
        email: string,
        address: string,
        leadSources: string,
        feedBack: string,
    },
    products: [
        {
            productId: ObjectId,
            quentity: number,
        }
    ],
    prices: {
        additionalCharges: number,
        addDiscount: number,
        paymentMethod: string,
        paid: number,
        pending: number,
        gst: number,
        total: number
    },
    quotationNo: string,
    createdDate: Date,
    updatedDate: Date,
    quotationStatus: string,
    quotationHistory: [
        {
            historyDate: Date,
            historyCommand: string,
            historyStatus: string
        }
    ]

}

const QuotationSchema = new Schema({
    customerDetails: {
        customerName: { type: String },
        mobile: { type: String },
        email: { type: String },
        address: { type: String },
        leadSources: { type: String },
        feedBack: { type: String },
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
            quentity: { type: Number },

        }
    ],
    prices: {
        additionalCharges: { type: Number, default: 0 },
        addDiscount: { type: Number, default: 0 },
        paymentMethod: { type: String },
        paid: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        gst: { type: Number },
        total: { type: Number }
    },
    quotationNo: { type: String },
    createdDate: { type: Date },
    updatedDate: { type: Date },
    quotationStatus: { type: String, enum: ["Sent", "Approved", "Rejected", "Invoice", "Draft"], default: "Draft" },
    quotationHistory: [
        {
            historyDate: { type: Date },
            historyCommand: { type: String },
            historyStatus: {
                type: String,
                enum: ["Sent", "Approved", "Rejected", "Invoice", "Draft"],
                default: "Draft"
            }
        }
    ]

})

export const QuotationMODAL = model<IQuotation>('Quotations', QuotationSchema)