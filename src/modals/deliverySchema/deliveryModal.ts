import { Schema, model } from "mongoose";
import { IDeliverySchema } from "../../@types/deliveryTypes";


const deliverySchema: Schema = new Schema<IDeliverySchema>({
    invoiceId: { trim: true, type: Schema.Types.ObjectId, ref: 'Invoices' },
    deliveryPersonId: { trim: true, type: Schema.Types.ObjectId, ref: 'User' },
    customerId: { trim: true, type: Schema.Types.ObjectId, ref: 'Customers' },
    branchId: { trim: true, type: Schema.Types.ObjectId, ref: 'Branch' },
    status: { trim: true, type: String, enum: ['Assigned', 'Completed'], default: 'Assigned' },
    installationProof: { trim: true, type: String, default: '' },
    installedDate: { trim: true, type: Date },
    createdPerson: { trim: true, type: Schema.Types.ObjectId, ref: 'User' },
    geoLocation: { type: Object, default: null }
});

export const DELIVERYMODAL = model<IDeliverySchema>("Delivery", deliverySchema)
