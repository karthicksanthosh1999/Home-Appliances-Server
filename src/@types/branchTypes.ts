import { Request } from 'express';

export interface ICreateBranch extends Request {
    body: {
        branchName: string,
        managerId: string,
        street: string,
        city: string,
        state: string,
        country: string,
        branchId?: string,
    }
}