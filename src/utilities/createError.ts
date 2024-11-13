import { TCustomerErrorType } from "../@types/errorTypes";

export const createError = (message: string, statusCode: number): TCustomerErrorType => {
    const error: TCustomerErrorType = new Error(message);
    error.statusCode = statusCode;
    return error;
}


