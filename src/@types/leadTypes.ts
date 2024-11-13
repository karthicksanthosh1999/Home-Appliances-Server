import { Request } from 'express';
import { ILead } from '../modals/leadSchema/leadModal';

export interface ICreateLead extends Request {
    body: {
        _id: string,
        date: Date,
        customerName: string,
        mobile: string,
        email: string,
        leadId: string,
        address: string,
        knownVia: string,
        updatedOn: Date,
        remainder: string,
        status: string,
        suggestion: string,
        branch: string,
    }
}

export interface IGetSingleLead extends Request {
    params: {
        id: string,
    }
}

export interface ISearchLead extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        branch?: string
    }
}

export interface IMultipleLead extends Request {
    body: {
        ids: []
    }
}

export interface IBulkUpload extends Request {
    body: {
        leads: ILead[]
    }
}

export interface ITodayLeads extends Request {
    query: {
        today: string
    }
}