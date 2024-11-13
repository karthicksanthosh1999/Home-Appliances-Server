import { Request } from 'express';

export interface ICreateEmployee extends Request {
    body: {
        _id: string,
        employeeName: string,
        email: string,
        mobile: string,
        address: string,
        branch: string,
        dob: string,
        doj: string,
        salary: number,
        idProof: string
    }
}

export interface IGetSingleEmployee extends Request {
    params: {
        id: string,
    }
}

export interface ISearchEmployee extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        branch?: string
    }
}

export interface IMultipleEmployee extends Request {
    body: {
        ids: []
    }
}