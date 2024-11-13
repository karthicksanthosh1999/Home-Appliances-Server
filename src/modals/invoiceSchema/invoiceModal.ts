import mongoose, { Document, model, ObjectId, Schema } from "mongoose";
import { ICustomer } from "../customerSchema/customerModal";

// export interface IInvoice extends Document {
//     customerDetails: {
//         customerName: string,
//         mobile: string,
//         email: string,
//         address: string,
//         knownVia: string,
//         feedBack: string,
//     },
//     products: [
//         {
//             purchasedDate: Date,
//             productId: ObjectId,
//             quentity: number,
//         }
//     ],
//     prices: {
//         additionalCharges: number,
//         addDiscount: number,
//         paymentMethod: string,
//         paid: number,
//         pending: number,
//         gst: number,
//         total: number
//     },
//     invoiceNo: string
// }

export interface IInvoice extends Document {
    customerDetails: ICustomer,
    branchId: ObjectId,
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
    invoiceNo?: string,
    createdDate?: Date,
    updatedDate?: Date,
    quotationStatus?: string,
    quotationHistory?: [
        {
            historyDate?: Date,
            historyCommand?: string,
            historyStatus?: string
        }
    ]

}

const invoiceSchema = new Schema({
    customerDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: "Customers"
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Branch"
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
    invoiceNo: { type: String },
    createdDate: { type: Date },
    updatedDate: { type: Date },
    quotationStatus: { type: String, enum: ["Sent", "Approved", "Rejected", "Invoice", "Draft"], default: "Invoice" },
    quotationHistory: [
        {
            historyDate: { type: Date },
            historyCommand: { type: String },
            historyStatus: {
                type: String,
                enum: ["Sent", "Approved", "Rejected", "Invoice", "Draft"],
                default: "Invoice"
            }
        }
    ]

})

export const INVOICEMODAL = model<IInvoice>('Invoices', invoiceSchema)