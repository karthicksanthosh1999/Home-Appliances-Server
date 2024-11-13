import { Request, Response, NextFunction } from "express";
import { TCustomerErrorType } from "../@types/errorTypes";


export const errorHandler = (err: TCustomerErrorType, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"
    const stack = err.stack
    const name = err.name

    res.status(statusCode).json({
        message,
        statusCode,
        success: false,
        name,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
}