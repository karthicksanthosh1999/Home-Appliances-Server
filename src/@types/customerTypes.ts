import { Request } from 'express';
import { IBranch } from '../modals/branchSchema/branchModal';

export interface ICreateCustomer extends Request {
    body: {
        _id: string,
        date: string,
        customerName: string,
        customerId: string,
        branch: string,
        mobile: string,
        email: string,
        address: string,
        knownVia: string,
        feedBack: string,
    }
}

export interface IGetSingleCustomer extends Request {
    params: {
        id: string,
    }
}

export interface IExistingCustomer extends Request {
    params: {
        mobile: string
    }
}

export interface ISearchCustomer extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        branch?: string
    }
}

export interface IMultipleCustomer extends Request {
    body: {
        ids: []
    }
}

export interface ICustomerResponse extends Request {
    _id: string,
    date: Date,
    customerName: string,
    customerId: string,
    branch: IBranch,
    mobile: string,
    email: string,
    address: string,
    knownVia: string,
    feedBack: string,
    customerStatus: "Customer" | "Lead"
}