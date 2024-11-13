import { Request } from "express";
import { ObjectId } from "mongoose";
import { IGiftAssignmentSchema } from "./giftTypes";

export interface ICreateInvoice extends Request {
    body: {
        customerDetails: {
            _id: ObjectId,
            customerId: string,
            customerName: string,
            mobile: string,
            email: string,
            address: string,
            knownVia: string,
            feedBack: string,
            branch: ObjectId,
            date: Date
        },
        branchId: ObjectId,
        products: [
            {
                purchasedDate: Date,
                productId: ObjectId,
                quentity: number,
            }
        ],
        prices: {
            additionalCharges: number,
            addDiscount: number,
            paymentMethod: string,
            paid: number,
            pending: number
        }
        giftAssignMent?: {
            invoiceId: string,
            customerId: ObjectId,
            gifttId: ObjectId,
            assignedDate: Date,
            quantity: Number,
            value: Number
        }
    }
}


export interface IGetSingleInvoice extends Request {
    params: {
        id: string
    }
}
export interface ISearchInvoice extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        branch?: string
    }
}

export interface IMultipleInvoice extends Request {
    body: {
        ids: []
    }
}