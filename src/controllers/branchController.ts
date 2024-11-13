import { Request, RequestHandler } from "express";
import { ICreateBranch } from "../@types/branchTypes";
import { BRANCHMODAL, IBranch } from "../modals/branchSchema/branchModal";
import { IApiResponse } from "../helper/apiResponse";
import { FilterQuery } from "mongoose";
import { CUSTOMERMODAL } from "../modals/customerSchema/customerModal";
import { PRODUCTMODAL } from "../modals/productSchema/productModal";
import { EMPLOYEEMODAL } from "../modals/employeeSchema/employeeModal";

interface ITotalBranchDetails {
    customerData: number,
    productData: number,
    employeeData: number,
}

class BranchController {

    createBranch: RequestHandler = async (req: ICreateBranch, res): Promise<void> => {
        const { branchName, city, country, managerId, state, street } = req.body;
        // Create Branch
        const branchCount = await BRANCHMODAL.countDocuments();
        const neexBranchNumber = (branchCount + 1).toString().padStart(3, "0")
        const newBranchId = `B${neexBranchNumber}`

        const data = await BRANCHMODAL.create({
            branchName, city, country, managerId, state, street, branchId: newBranchId
        })
        const apiRes: IApiResponse<IBranch> = {
            message: "Branch created successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)
    }

    getAllBranchs: RequestHandler = async (req: ICreateBranch, res): Promise<void> => {
        const data = await BRANCHMODAL.find();
        const apiRes: IApiResponse<IBranch[]> = {
            message: "Branch fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    getSingleBranch: RequestHandler = async (req: Request, res): Promise<void> => {

        const { id } = req.params;

        const data = await BRANCHMODAL.findById(id);

        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Branch not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const apiRes: IApiResponse<IBranch> = {
            message: "Branch fetched successfully",
            statusCode: 200,
            success: true,
            responses: data,
        };
        res.status(200).json(apiRes);

    }

    deleteBranch: RequestHandler = async (req: Request, res): Promise<void> => {
        try {
            const { id } = req.params;

            const data = await BRANCHMODAL.findByIdAndDelete(id);

            if (!data) {
                const apiRes: IApiResponse<null> = {
                    message: "Branch not found",
                    statusCode: 404,
                    success: false,
                };
                res.status(404).json(apiRes);
                return;
            }

            const apiRes: IApiResponse<IBranch> = {
                message: "Branch deleted successfully",
                statusCode: 200,
                success: true,
                responses: data,
            };
            res.status(200).json(apiRes);

        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Error fetching branch",
                statusCode: 500,
                success: false,
                error: (error as Error).message || String(error)
            };
            res.status(500).json(apiRes);
        }
    }

    multipleDelete: RequestHandler = async (req: Request, res): Promise<void> => {
        const { ids } = req.body;
        try {
            const data = await BRANCHMODAL.deleteMany({ _id: { $in: ids } });
            const apiRes: IApiResponse<number> = {
                message: "Branch deleted successfully",
                statusCode: 200,
                success: true,
                responses: data.deletedCount,
            };
            res.status(200).json(apiRes);

        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Error fetching branch",
                statusCode: 500,
                success: false,
                error: (error as Error).message || String(error)
            };
            res.status(500).json(apiRes);
        }
    }

    updateBranch: RequestHandler = async (req: Request, res): Promise<void> => {
        const { id } = req.params;

        const data = await BRANCHMODAL.findByIdAndUpdate(id, req.body, { new: true })
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Branch not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const apiRes: IApiResponse<IBranch> = {
            message: "Branch updated successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)
    }

    searchBranchs: RequestHandler = async (req: Request, res): Promise<void> => {
        const { search, page = 1, limit = 10 } = req.query;

        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const query: FilterQuery<IBranch> = {};

            if (search) {
                query.$or = [
                    { branchName: { $regex: search, $options: "i" } },
                    { branchId: { $regex: search, $options: "i" } }
                ]
            }
            // if(filter){
            //   if(filter.gender) query.gender = filter.gender
            // }

            const branches = await BRANCHMODAL.find(query).skip(skip).limit(limitNumber);
            const totalBranches = await BRANCHMODAL.countDocuments(query);
            res.status(200).json({
                message: "Branch fetch successfully",
                statusCode: 200,
                success: true,
                responses: {
                    branches,
                    pagination: {
                        currentPage: pageNumber,
                        totalPages: Math.ceil(totalBranches / limitNumber),
                        totalBranches,
                    },
                },
            });

        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Internal server error",
                statusCode: 500,
                success: false,
                error: (error as Error).message || String(error)
            }
            res.status(500).json(apiRes)
        }
    }

    totalDetailsBranchs: RequestHandler = async (req: Request, res): Promise<void> => {
        const { id } = req.params;

        try {
            const customerData = await CUSTOMERMODAL.find({ branch: id }).countDocuments();
            const productData = await PRODUCTMODAL.find({ branch: id }).countDocuments();
            const employeeData = await EMPLOYEEMODAL.find({ branch: id }).countDocuments();

            const totalBranchDetails = {
                customerData,
                productData,
                employeeData,
            }

            const apiRes: IApiResponse<ITotalBranchDetails> = {
                message: "Branch updated successfully",
                statusCode: 201,
                success: true,
                responses: totalBranchDetails
            }
            res.status(201).json(apiRes)


        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Internal server error",
                statusCode: 500,
                success: false,
                error: (error as Error).message || String(error)
            }
            res.status(500).json(apiRes)
        }
    }

}

export default new BranchController()