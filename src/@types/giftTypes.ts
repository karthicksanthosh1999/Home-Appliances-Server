import { ObjectId, Document } from "mongoose";

export interface IGiftSchema extends Document {
    _id: ObjectId,
    giftName: string,
    giftType: string,
    giftValue: number,
    quantity: number,
    createdPerson: ObjectId,
}

export interface IGiftAssignmentSchema extends Document {
    _id: ObjectId,
    invoiceId: ObjectId,
    customerId: ObjectId,
    branchId: ObjectId,
    gifttId: ObjectId,
    assignedDate: Date,
    quantity: Number,
    value: Number
}