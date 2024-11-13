import { Request } from 'express';

export interface ICreateProduct extends Request {
    body: {
        productName: string,
        brand: string,
        branch: string,
        category: string,
        dealerName: string,
        mrp: string,
        count: number,
    }
}

export interface IGetSingleProduct extends Request {
    params: {
        id: string,
    }
}

export interface ISearchProduct extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        productId?: string
        productName?: string
    }
}