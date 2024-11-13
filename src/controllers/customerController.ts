import { RequestHandler } from "express";
import { ICreateCustomer, ICustomerResponse, IExistingCustomer, IGetSingleCustomer, IMultipleCustomer, ISearchCustomer } from "../@types/customerTypes";
import { CUSTOMERMODAL, ICustomer } from "../modals/customerSchema/customerModal";
import { currentDateWithTime, IApiResponse } from "../helper/apiResponse";
import { FilterQuery } from "mongoose";

class CustomersClass {

    createCustomer: RequestHandler = async (req: ICreateCustomer, res): Promise<void> => {
        const { address, branch, customerName, email, feedBack, knownVia, mobile } = req.body;

        const customerCount = await CUSTOMERMODAL.countDocuments();
        const nextCustomerNumber = (customerCount + 1).toString().padStart(3, "0");
        const newCustomerId = `CUS${nextCustomerNumber}`;

        const data = await CUSTOMERMODAL.create({
            address,
            branch,
            customerId: newCustomerId,
            customerName,
            date: currentDateWithTime(),
            email,
            feedBack,
            knownVia,
            mobile
        })
        const populatedData = await data.populate({ path: 'branch', select: "-createdAt -updatedAt -__v" })
        res.status(201).json({
            message: "Customer created successfully",
            statusCode: 201,
            success: true,
            responses: populatedData
        })
    }

    getSingleCutomer: RequestHandler<{ id: string }> = async (req: IGetSingleCustomer, res): Promise<void> => {
        const { id } = req.params;
        const data = await CUSTOMERMODAL.findById(id).populate({ path: 'branch', select: "-createdAt -updatedAt -__v" });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Customer not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ICustomer> = {
            message: "Customer fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)


    }

    existingCustomer: RequestHandler<{ mobile: string }> = async (req: IExistingCustomer, res): Promise<void> => {
        const { mobile } = req.params;
        const data = await CUSTOMERMODAL.findOne({ mobile });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "User not found",
                statusCode: 200,
                success: true
            }
            res.status(200).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ICustomer> = {
            message: "Data fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    getAllCustomer: RequestHandler = async (req: ICreateCustomer, res): Promise<void> => {
        const data = await CUSTOMERMODAL.find().populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).sort({ createdAt: -1 });
        const apiRes: IApiResponse<ICustomer[]> = {
            message: "Data fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    deleteCustomer: RequestHandler<{ id: string }> = async (req: IGetSingleCustomer, res): Promise<void> => {
        const { id } = req.params;
        const data = await CUSTOMERMODAL.findByIdAndDelete(id);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Customer not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ICustomer> = {
            message: "Customer deleted successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    updateCustomer: RequestHandler<{ id: string }> = async (req: IGetSingleCustomer, res): Promise<void> => {
        const { id } = req.params;
        const data = await CUSTOMERMODAL.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Customer not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const populatedData = await data.populate({ path: 'branch', select: "-createdAt -updatedAt -__v" })
        res.status(200).json({
            message: "Customer update successfully",
            statusCode: 200,
            success: true,
            responses: populatedData
        })
    }

    searchCustomer: RequestHandler = async (req: ISearchCustomer, res): Promise<void> => {
        const { search, limit = 10, page = 1 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: FilterQuery<ICustomer> = {};

        if (search) {
            query.$or = [
                { customerId: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            ]
        }

        const customers = await CUSTOMERMODAL.
            find(query).
            skip(skip).
            limit(limitNumber).
            populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).
            sort({ createdAt: -1 })
        const totalCustomers = await CUSTOMERMODAL.countDocuments(query);
        res.status(200).json({
            message: "Branch fetch successfully",
            statusCode: 200,
            success: true,
            responses: {
                customers,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalCustomers / limitNumber),
                    totalCustomers,
                },
            },
        });
    }

    multipleDelete: RequestHandler = async (req: IMultipleCustomer, res): Promise<void> => {
        const { ids } = req.body;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ message: "No valid IDs provided", success: false })
                return
            }
            const data = await CUSTOMERMODAL.deleteMany({ _id: { $in: ids } }).populate({ path: 'branch', select: "-createdAt -updatedAt -__v" })

            const apiRes: IApiResponse<number> = {
                message: "Data deleted successfully",
                statusCode: 200,
                success: true,
                responses: data.deletedCount
            };
            res.status(200).json(apiRes);

        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Internal error occured",
                statusCode: 500,
                success: false,
                error: (error as Error).message || String(error)
            };
            res.status(500).json(apiRes);
        }
    };

}
export default new CustomersClass();