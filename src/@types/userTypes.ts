import { Request } from "express";
import { ObjectId } from "mongoose";

export interface ICreateUser extends Request {
    body: {
        _id: string;
        firstName: string;
        lastName: string;
        mobile: string;
        email: string;
        password: string;
        userType: string;
        profile: string;
        dob: string,
        doj: string,
        salary: number,
        gender: string,
        address: string,
        branch: ObjectId
    }
}
export interface IGetSingleUser extends Request {
    params: {
        id: string,
    }
}

export interface ISearchUser extends Request {
    query: {
        search?: string,
        page?: string,
        limit?: string,
        email?: string,
        mobile?: string,
        firstname?: string
    }
}

export interface IMultipleUser extends Request {
    body: {
        ids: []
    }
}