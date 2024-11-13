import { Request } from "express";
import { ObjectId } from "mongoose";

export interface ICreateQuotation extends Request {
    body: {
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
        }
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
}


export interface IGetSingleQuotation extends Request {
    params: {
        id: string
    }
}
export interface ISearchQuotation extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        branch?: string
    }
}

export interface IMultipleQuotation extends Request {
    body: {
        ids: []
    }
}

export interface IStatusUpdateQuotation extends Request {
    body: {
        id: ObjectId,
        quotationStatus: String
    }
}