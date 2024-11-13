import { Request } from "express";
import { Document, ObjectId } from "mongoose";
import { IInvoice } from "../modals/invoiceSchema/invoiceModal";
import { IUser } from "../modals/userSchema/userModal";
import { IBranch } from "../modals/branchSchema/branchModal";
import { ICustomer } from "../modals/customerSchema/customerModal";


export interface ICreateDelivery extends Request {
    body: {
        _id: ObjectId,
        invoiceId: ObjectId,
        branchId: ObjectId,
        deliveryPersonId: ObjectId,
        customerId: ObjectId,
        status: string,
        installationProof: string,
        installedDate: Date,
        createdPerson: ObjectId,
        lat: string,
        lang: string
    }
}

export interface IRoot {
    place_id: string
    licence: string
    osm_type: string
    osm_id: string
    lat: string
    lon: string
    display_name: string
    address: IAddress
}

export interface IAddress {
    road: string
    suburb: string
    village: string
    city: string
    county: string
    state_district: string
    state: string
    postcode: string
    country: string
    country_code: string
}


export interface IDeliverySchema extends Document {
    _id: Object,
    invoiceId: ObjectId,
    branchId: ObjectId,
    deliveryPersonId: ObjectId,
    customerId: ObjectId,
    status: string,
    installationProof: string,
    installedDate: Date,
    createdPerson: ObjectId,
    geoLocation: {
        place_id: string
        licence: string
        osm_type: string
        osm_id: string
        lat: string
        lon: string
        display_name: string
        address: {
            road: string
            suburb: string
            village: string
            city: string
            county: string
            state_district: string
            state: string
            postcode: string
            country: string
            country_code: string
        }
    }
}

export interface IDeliveryResponse extends Document {
    _id: Object,
    invoiceId: IInvoice,
    branchId: IBranch,
    deliveryPersonId: IUser,
    customerId: ICustomer,
    status: string,
    installationProof: string,
    installedDate: Date,
    createdPerson: IUser

}