import { Request, RequestHandler } from "express";
import { ICreateProduct } from "../@types/productTypes";
import { PRODUCTMODAL, IProduct } from "../modals/productSchema/productModal";
import { currentDateWithTime, IApiResponse } from "../helper/apiResponse";
import { FilterQuery } from "mongoose";

class ProductController {

    createProduct: RequestHandler = async (req: ICreateProduct, res): Promise<void> => {
        const { branch, brand, category, count, dealerName, mrp, productName } = req.body;
        const productCount = await PRODUCTMODAL.countDocuments();
        const neexProductNumber = (productCount + 1).toString().padStart(3, "0")
        const newProductId = `B${neexProductNumber}`

        const data = await PRODUCTMODAL.create({
            branch, brand, category, count, date: currentDateWithTime(), productId: newProductId, dealerName, mrp, productName, branchId: newProductId
        });

        const populatedData = await data.populate({ path: 'branch', select: "-createdAt -updatedAt -__v" })

        if (!populatedData) {
            const apiRes: IApiResponse<null> = {
                message: "Product not populated",
                statusCode: 400,
                success: false
            }
        }

        const apiRes: IApiResponse<IProduct> = {
            message: "Product created successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)
    }

    getAllProducts: RequestHandler = async (req: ICreateProduct, res): Promise<void> => {
        const data = await PRODUCTMODAL.find().populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).sort({ createAt: -1 });
        const apiRes: IApiResponse<IProduct[]> = {
            message: "Product fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    getSingleProduct: RequestHandler = async (req: Request, res): Promise<void> => {

        const { id } = req.params;

        const data = await PRODUCTMODAL.findById(id).populate({ path: 'branch', select: "-createdAt -updatedAt -__v" });;

        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Product not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const apiRes: IApiResponse<IProduct> = {
            message: "Product fetched successfully",
            statusCode: 200,
            success: true,
            responses: data,
        };
        res.status(200).json(apiRes);

    }

    deleteProduct: RequestHandler = async (req: Request, res): Promise<void> => {
        try {
            const { id } = req.params;

            const data = await PRODUCTMODAL.findByIdAndDelete(id);

            if (!data) {
                const apiRes: IApiResponse<null> = {
                    message: "Product not found",
                    statusCode: 404,
                    success: false,
                };
                res.status(404).json(apiRes);
                return;
            }

            const apiRes: IApiResponse<IProduct> = {
                message: "Product deleted successfully",
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
            await PRODUCTMODAL.deleteMany({ _id: { $in: ids } });
            const data = await PRODUCTMODAL.find({ _id: { $in: ids } });
            const apiRes: IApiResponse<IProduct[]> = {
                message: "Product deleted successfully",
                statusCode: 200,
                success: true,
                responses: data,
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
    }

    updateProduct: RequestHandler = async (req: Request, res): Promise<void> => {
        const { id } = req.params;

        const data = await PRODUCTMODAL.findByIdAndUpdate(id, req.body, { new: true })
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Product not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const apiRes: IApiResponse<IProduct> = {
            message: "Product updated successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)
    }

    searchProducts: RequestHandler = async (req: Request, res): Promise<void> => {
        const { search, page = 1, limit = 10 } = req.query;

        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const query: FilterQuery<IProduct> = {};

            if (search) {
                query.$or = [
                    { productName: { $regex: search, $options: "i" } },
                    { productId: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } }
                ]
            }
            // if(filter){
            //   if(filter.gender) query.gender = filter.gender
            // }

            const products = await PRODUCTMODAL.find(query).skip(skip).limit(limitNumber).populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).sort({ createAt: -1 });
            const totalProductes = await PRODUCTMODAL.countDocuments(query);
            res.status(200).json({
                message: "Product fetch successfully",
                statusCode: 200,
                success: true,
                responses: {
                    products,
                    pagination: {
                        currentPage: pageNumber,
                        totalPages: Math.ceil(totalProductes / limitNumber),
                        totalProductes,
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

    lowProducts: RequestHandler = async (req: Request, res): Promise<void> => {

        const data = await PRODUCTMODAL.find({
            count: { $lte: 30 }
        }).populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).sort({ createAt: -1 })
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Product not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const apiRes: IApiResponse<IProduct[]> = {
            message: "Product fetched successfully",
            statusCode: 200,
            success: true,
            responses: data,
        };
        res.status(200).json(apiRes);
    }
}

export default new ProductController()