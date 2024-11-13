import { NextFunction, RequestHandler, Response } from 'express';
import { ICreateInvoice, IGetSingleInvoice, IMultipleInvoice, ISearchInvoice } from '../@types/invoiceTypes';
import { IInvoice, INVOICEMODAL } from '../modals/invoiceSchema/invoiceModal';
import { currentDateWithTime, IApiResponse } from '../helper/apiResponse';
import { FilterQuery } from 'mongoose';
import { CUSTOMERMODAL, ICustomer } from '../modals/customerSchema/customerModal';
import { createError } from '../utilities/createError';

let populatedDatas = { path: 'products.productId customerDetails customerDetails.branch branchId', select: "-updatedAt -createdAt, -__v -date -dealerName" }
class InvoiceClass {

    public populatedGiftData = { path: "gifttId customerId branchId", select: "-updatedAt -createdAt, -__v" }

    createInvoice: RequestHandler = async (req: ICreateInvoice, res: Response, next: NextFunction): Promise<void> => {
        const { customerDetails, prices, products, branchId, giftAssignMent } = req.body;

        try {
            // Generate Invoice Number
            const invoiceCount = await INVOICEMODAL.countDocuments();
            const nextInvoiceCount = (invoiceCount + 1).toString().padStart(3, "0");
            const newInvoiceCount = `Bill${nextInvoiceCount}`;

            // Find or create customer
            let customer: ICustomer;
            const existingCustomer = await CUSTOMERMODAL.findOne({
                $or: [
                    { email: customerDetails?.email },
                    { mobile: customerDetails?.mobile }
                ]
            });

            if (existingCustomer) {
                customer = existingCustomer;
                console.log("Existing Customer");
            } else {
                const customerCount = await CUSTOMERMODAL.countDocuments();
                const nextCustomerNumber = (customerCount + 1).toString().padStart(3, "0");
                const newCustomerId = `CUS${nextCustomerNumber}`;

                customer = await CUSTOMERMODAL.create({
                    customerName: customerDetails?.customerName,
                    customerId: newCustomerId,
                    branch: customerDetails?.branch,
                    mobile: customerDetails?.mobile,
                    email: customerDetails?.email,
                    address: customerDetails?.address,
                    knownVia: customerDetails?.knownVia,
                    feedBack: customerDetails?.feedBack,
                    date: currentDateWithTime()
                });
            }

            // Create invoice
            const data = await INVOICEMODAL.create({
                customerDetails: customer._id,
                prices,
                products,
                invoiceNo: newInvoiceCount,
                branchId
            });

            // Populate invoice data
            const populatedData = await data.populate("customerDetails");

            // let giftData: IGiftAssignmentSchema | null = null;
            // let populatedGift: IGiftAssignmentSchema | null = null;
            // if (giftAssignMent) {
            //     const gift = await GIFTMODAL.findById(giftAssignMent?.gifttId) as IGiftSchema;

            //     if (gift && Number(gift.quantity) >= Number(giftAssignMent.quantity)) {
            //         const updatedQuantity = gift.quantity - Number(giftAssignMent.quantity);
            //         const giftAssignemtValue = Number(giftAssignMent.quantity) * (Number(gift.giftValue) / Number(gift.quantity))
            //         const updatedValue = Number(gift.giftValue) - (Number(giftAssignMent.quantity) * (Number(gift.giftValue) / Number(gift.quantity)));
            //         giftData = await GIFTASSIGNMODAL.create({
            //             invoiceId: populatedData._id,
            //             customerId: customer._id,
            //             branchId: populatedData?.branchId,
            //             gifttId: giftAssignMent?.gifttId,
            //             assignedDate: currentDateWithTime(),
            //             value: giftAssignemtValue,
            //             quantity: giftAssignMent?.quantity
            //         });

            //         // Update the gift document with the new quantity and value
            //         await GIFTMODAL.updateOne(
            //             { _id: giftAssignMent?.gifttId },
            //             {
            //                 $set: {
            //                     quantity: updatedQuantity,
            //                     giftValue: updatedValue
            //                 }
            //             }
            //         );
            //     } else {
            //         throw createError("Insufficien Quantiry", 400)
            //     }
            // }
            res.status(201).json({
                message: 'Invoice created successfully',
                statusCode: 201,
                success: true,
                responses: populatedData,
            });
        } catch (error) {
            next(error)
        }
    }

    getAllInvoice: RequestHandler = async (req: ICreateInvoice, res): Promise<void> => {
        const data = await INVOICEMODAL.find().populate(populatedDatas);
        res.status(200).json({
            message: "Invoice fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        })
    }

    getSingleInvoice: RequestHandler<{ id: string }> = async (req: IGetSingleInvoice, res): Promise<void> => {
        const { id } = req.params;
        const data = await INVOICEMODAL.findById(id).populate(populatedDatas);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Data not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        res.status(200).json({
            message: "Invoice fetch successfully",
            statusCode: 201,
            success: true,
            responses: data
        })
    }

    deleteInvoice: RequestHandler<{ id: string }> = async (req: IGetSingleInvoice, res): Promise<void> => {
        const { id } = req.params;
        const data = await INVOICEMODAL.findByIdAndDelete(id).populate(populatedDatas);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Data not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const populatedData = await data.populate(populatedDatas)
        res.status(200).json({
            message: "Invoice delete successfully",
            statusCode: 201,
            success: true,
            responses: populatedData
        })
    }

    updateInvoice: RequestHandler<{ id: string }> = async (req: IGetSingleInvoice, res): Promise<void> => {
        const { id } = req.params;
        const data = await INVOICEMODAL.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Data not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const populateData = await data.populate(populatedDatas)
        res.status(200).json(
            {
                message: "Invoice update successfully",
                statusCode: 201,
                success: true,
                responses: populateData
            })
    }

    searchInvoice: RequestHandler = async (req: ISearchInvoice, res): Promise<void> => {
        const { search, limit = 10, page = 1 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: FilterQuery<IInvoice> = {};

        if (search) {
            query.$or = [
                { invoiceNo: { $regex: search, $options: "i" } },
            ]
        }

        const invoices = await INVOICEMODAL.
            find(query).
            skip(skip).
            limit(limitNumber)
            .populate(populatedDatas).
            sort({ createdAt: -1 })
        const totalInvoices = await INVOICEMODAL.countDocuments(query);
        res.status(200).json({
            message: "Branch fetch successfully",
            statusCode: 200,
            success: true,
            responses: {
                invoices,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalInvoices / limitNumber),
                    totalInvoices,
                },
            },
        });
    }

    multipleDelete: RequestHandler = async (req: IMultipleInvoice, res: Response, next: NextFunction): Promise<void> => {
        const { ids } = req.body;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                createError("Ids shoule be an array", 400)
            }
            const data = await INVOICEMODAL.deleteMany({ _id: { $in: ids } }).populate(populatedDatas);

            res.status(200).json({
                message: "Data deleted successfully",
                statusCode: 200,
                success: true,
                responses: data.deletedCount
            });

        } catch (error) {
            next(error)
        }
    };

}

export default new InvoiceClass();