import { NextFunction, RequestHandler, Response, Request } from "express";
import { createError } from "../utilities/createError";
import { GIFTASSIGNMODAL } from "../modals/gitftSchema/giftAssignModal";
import { currentDateWithTime } from "../helper/apiResponse";
import { GIFTMODAL } from "../modals/gitftSchema/giftsModal";
import { IGiftAssignmentSchema, IGiftSchema } from "../@types/giftTypes";
import { INVOICEMODAL } from "../modals/invoiceSchema/invoiceModal";

class GiftAssignmentController {
    private invoicePopulated = { path: 'products.productId customerDetails customerDetails.branch branchId', select: "-updatedAt -createdAt, -__v -date -dealerName" }
    private populated = { path: "invoiceId customerId gifttId branchId", select: "-__v -createdAt -updatedAt" }

    createGiftAssignment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { invoiceId, gifttId, quantity } = req.body;
        try {
            let giftData: IGiftAssignmentSchema | null = null;

            const gift = await GIFTMODAL.findById(gifttId) as IGiftSchema;

            const invoice = await INVOICEMODAL.findById(invoiceId).populate(this.invoicePopulated)

            if (gift && Number(gift.quantity) >= Number(quantity)) {
                // Calculate the updated quantity and value
                const updatedQuantity = gift.quantity - Number(quantity);
                const assignemtValue = Number(quantity) * (Number(gift.giftValue) / Number(gift.quantity))
                const updatedValue = Number(gift.giftValue) - (Number(quantity) * (Number(gift.giftValue) / Number(gift.quantity)));
                // Create the gift assignment
                giftData = await GIFTASSIGNMODAL.create({
                    invoiceId: invoice?._id,
                    customerId: invoice?.customerDetails?._id,
                    branchId: invoice?.branchId,
                    assignedDate: currentDateWithTime(),
                    value: assignemtValue,
                    gifttId,
                    quantity,
                });

                // Update the gift document with the new quantity and value
                await GIFTMODAL.updateOne(
                    { _id: gifttId },
                    {
                        $set: {
                            quantity: updatedQuantity,
                            giftValue: updatedValue
                        }
                    }
                );
            } else {
                throw createError("Insufficien Quantiry", 400)
            }
            const populatedData = await giftData.populate(this.populated);
            res.status(201).json({
                message: "Gift assigned successfully",
                statusCode: 201,
                success: true,
                responses: populatedData
            })
        } catch (error) {
            next(error)
        }
    }
    getAllGiftsAssignment: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await GIFTASSIGNMODAL.find().populate(this.populated);
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
    getSingleGiftAssignment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await GIFTASSIGNMODAL.findById(id).populate(this.populated);
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
    updateGiftAssignment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await GIFTASSIGNMODAL.findByIdAndUpdate(id, req.body, { new: true }).populate(this.populated);
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
    deleteGiftAssignment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        try {
            const data = await GIFTASSIGNMODAL.findByIdAndDelete(id);
            res.status(200).json({
                message: "Assigned gift deleted successfully",
                statuCode: 200,
                success: true,
                responses: data
            })
        } catch (error) {
            next(error)
        }
    }
    invoiceMatchedGifts: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { invoiceId } = req.params;
        try {
            const data = await GIFTASSIGNMODAL.findOne({ invoiceId: invoiceId })
            if (!data) {
                throw createError("This invoice has no gift", 200)
            }
            const populatedData = await data?.populate(this.populated)
            res.status(200).json({
                message: "GIft fetch successfully",
                success: true,
                statusCode: 200,
                responses: populatedData
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new GiftAssignmentController()