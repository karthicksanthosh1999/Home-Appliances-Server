import { GIFTMODAL } from "../modals/gitftSchema/giftsModal";
import { IGiftSchema } from "../@types/giftTypes";
import { NextFunction, RequestHandler, Response, Request } from "express";
import { createError } from "../utilities/createError";
import { FilterQuery } from "mongoose";

class GiftController {

    private populated = { path: "createdPerson", select: "-__v -createdAt -updatedAt -salary -password" }

    createGift: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { createdPerson, giftValue, giftType, giftName, quantity } = req.body;
        try {
            if (!createdPerson || !giftType || !giftValue || !giftName || !quantity) {
                throw createError("Please fill the all required fields", 400);
            }
            const data = await GIFTMODAL.create({
                createdPerson, giftValue, giftType, giftName, quantity
            })
            const populatedData = await data.populate(this.populated)
            res.status(201).json({
                message: "Gift created successfully",
                statusCode: 201,
                success: true,
                responses: populatedData
            })
        } catch (error) {
            next(error)
        }
    }
    getAllGifts: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await GIFTMODAL.find().populate(this.populated);
            res.status(200).json({
                message: "Gift fetch successfully",
                statusCode: 200,
                success: true,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }
    getSingleGift: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await GIFTMODAL.findById(id).populate(this.populated);
            if (!data) {
                throw createError("Gift not found", 404)
            }
            res.status(200).json({
                message: "Gift fetch successfully",
                statusCode: 200,
                success: true,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }
    updateGift: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await GIFTMODAL.findByIdAndUpdate(id, req.body, { new: true }).populate(this.populated);
            if (!data) {
                throw createError("Gift not found", 404)
            }
            res.status(200).json({
                message: "Gift update successfully",
                success: true,
                statusCode: 200,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }
    deleteGift: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await GIFTMODAL.findByIdAndDelete(id);
            res.status(200).json({
                message: "Gift deleted successfully",
                statuCode: 200,
                success: true,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }
    searchGift: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { limit = 10, page = 1, search } = req.query;
        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const query: FilterQuery<IGiftSchema> = {}
            if (search) {
                query.$or = [
                    { giftName: { $regex: search, $options: 'i' } },
                    { giftType: { $regex: search, $options: 'i' } }
                ]
            }

            const gifts = await GIFTMODAL.find(query).skip(skip).limit(limitNumber);
            const totalGifts = await GIFTMODAL.countDocuments(query);
            res.status(200).json({
                message: "Gift fetch successfully",
                statusCode: 200,
                success: true,
                responses: {
                    gifts,
                    pagination: {
                        currendPage: pageNumber,
                        totalPages: Math.ceil(totalGifts / limitNumber),
                        totalGifts
                    }
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new GiftController()