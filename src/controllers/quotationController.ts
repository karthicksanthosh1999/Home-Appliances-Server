import { RequestHandler, } from 'express';
import { ICreateQuotation, IGetSingleQuotation, IMultipleQuotation, ISearchQuotation, IStatusUpdateQuotation } from '../@types/quotationTypes';
import { IQuotation, QuotationMODAL } from '../modals/quotationSchema/quotationModal';
import { currentDateWithTime, IApiResponse, transportor } from '../helper/apiResponse';
import { FilterQuery } from 'mongoose';
import pdf from 'html-pdf';
import ejs from 'ejs';
import path from 'path';
import { getHistoryUpdate } from '../helper/historyResponses';
import { ICreateInvoice } from '../@types/invoiceTypes';
import { IInvoice, INVOICEMODAL } from '../modals/invoiceSchema/invoiceModal';

class QuotationClass {

    createQuotation: RequestHandler = async (req: ICreateQuotation, res): Promise<void> => {
        const { customerDetails, prices, products } = req.body;

        const QuotationCount = await QuotationMODAL.countDocuments();
        const nextQuotationCount = (QuotationCount + 1).toString().padStart(3, "0");
        const newQuotationCount = `Quo${nextQuotationCount}`;
        const data = await QuotationMODAL.create({
            customerDetails,
            prices,
            products,
            quotationNo: newQuotationCount,
            createdDate: currentDateWithTime(),
            updatedDate: currentDateWithTime(),
            quotationStatus: "Draft",
            quotationHistory: [{
                historyCommand: "Quotation Generated",
                historyDate: currentDateWithTime(),
                historyStatus: 'Draft'
            }]
        })
        const apiRes: IApiResponse<IQuotation> = {
            message: "Quotation created successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    getAllQuotation: RequestHandler = async (req: ICreateQuotation, res): Promise<void> => {
        const data = await QuotationMODAL.find().populate({ path: 'products.productId', select: "-createdAt -updatedAt, -__v -date -branch -dealerName" });
        const apiRes: IApiResponse<IQuotation[]> = {
            message: "Quotation fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    getSingleQuotation: RequestHandler<{ id: string }> = async (req: IGetSingleQuotation, res): Promise<void> => {
        const { id } = req.params;
        const data = await QuotationMODAL.findById(id);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Data not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IQuotation> = {
            message: "Quotation fetch successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    deleteQuotation: RequestHandler<{ id: string }> = async (req: IGetSingleQuotation, res): Promise<void> => {
        const { id } = req.params;
        const data = await QuotationMODAL.findByIdAndDelete(id);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Data not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IQuotation> = {
            message: "Quotation delete successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    updateStatusQuotation: RequestHandler<{ id: string }> = async (req: IStatusUpdateQuotation, res): Promise<void> => {
        const { id, quotationStatus } = req.body;

        const historyStatus = getHistoryUpdate(quotationStatus as string)

        const quotation = await QuotationMODAL.findById(id);
        if (!quotation) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const data = await QuotationMODAL.updateOne({ _id: id },
            {
                $set: {
                    updatedDate: currentDateWithTime(),
                    quotationStatus
                },
                $push: {
                    quotationHistory: historyStatus
                }
            }
        ).populate({ path: 'products.productId', select: "-createdAt -updatedAt, -__v -date -branch -dealerName" });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not updated",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const updateQuotatoins = await QuotationMODAL.findOne({ _id: id }).populate({ path: 'products.productId', select: "-createdAt -updatedAt, -__v -date -branch -dealerName" });

        if (!updateQuotatoins) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not updated",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IQuotation> = {
            message: "Quotation Updated successfully",
            statusCode: 201,
            success: true,
            responses: updateQuotatoins
        }
        res.status(201).json(apiRes)
    }

    updateQuotation: RequestHandler<{ id: string }> = async (req: IGetSingleQuotation, res): Promise<void> => {
        const { id } = req.params;
        const data = await QuotationMODAL.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Data not found",
                statusCode: 404,
                success: true,
            }
            res.status(200).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IQuotation> = {
            message: "Quotation update successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    searchQuotation: RequestHandler = async (req: ISearchQuotation, res): Promise<void> => {
        const { search, limit = 10, page = 1 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: FilterQuery<IQuotation> = {};

        if (search) {
            query.$or = [
                { QuotationNo: { $regex: search, $options: "i" } },
            ]
        }

        const quotations = await QuotationMODAL.
            find(query).
            skip(skip).
            limit(limitNumber)
            .populate({ path: 'products.productId', select: "-createdAt -updatedAt, -__v -date -branch -dealerName" }).
            sort({ createdAt: -1 })
        const totalQuotations = await QuotationMODAL.countDocuments(query);
        res.status(200).json({
            message: "Quotation fetch successfully",
            statusCode: 200,
            success: true,
            responses: {
                quotations,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalQuotations / limitNumber),
                    totalQuotations,
                },
            },
        });
    }

    multipleDelete: RequestHandler = async (req: IMultipleQuotation, res): Promise<void> => {
        const { ids } = req.body;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ message: "No valid IDs provided", success: false })
                return
            }
            const data = await QuotationMODAL.deleteMany({ _id: { $in: ids } });

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

    exportPdf: RequestHandler<{ id: string }> = async (
        req: IGetSingleQuotation,
        res
    ): Promise<void> => {
        const { id } = req.params;
        const data = await QuotationMODAL.findById(id).populate({ path: 'products.productId', select: "-createdAt -updatedAt, -__v -date -branch -dealerName" });

        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not found",
                statusCode: 404,
                success: true,
            };
            res.status(200).json(apiRes);
            return;
        }

        const templatePath = path.join(__dirname, "../views/quotation.ejs");

        ejs.renderFile(
            templatePath,
            {
                customerDetails: data.customerDetails,
                products: data.products,
                prices: data.prices,
                quotationNo: data.quotationNo,
                quotationStatus: data.quotationStatus,
                createdDate: data.createdDate,
                updatedDate: data.updatedDate,
            },
            (err, html) => {
                if (err) {
                    console.error("Error rendering EJS template", err);
                    if (!res.headersSent) {
                        res.status(500).json({ message: "Error generating PDF", err });
                    }
                    return;
                }

                pdf.create(html, { format: "A4", orientation: "portrait", border: "10mm" }).toStream((err, stream) => {
                    if (err) {
                        console.error("Error creating PDF", err);
                        if (!res.headersSent) {
                            res.status(500).send("Error generating PDF");
                        }
                        return;
                    }

                    if (!res.headersSent) {
                        res.setHeader("Content-Type", "application/pdf");
                        res.setHeader(
                            "Content-Disposition",
                            `attachment; filename=quotation-${data.quotationNo}.pdf`
                        );

                        stream.pipe(res);
                    }
                });
            }
        );
    };

    sendQuotation: RequestHandler<{ id: string }> = async (req: IGetSingleQuotation, res): Promise<void> => {
        const { id } = req.params;
        const data = await QuotationMODAL.findById(id).populate({ path: 'products.productId', select: "-createdAt -updatedAt, -__v -date -branch -dealerName" });

        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not found",
                statusCode: 404,
                success: true,
            };
            res.status(200).json(apiRes);
            return;
        }
        // Create EJS Template
        const templatePath = path.join(__dirname, "../views/quotation.ejs");
        const htmlContent = await ejs.renderFile(templatePath, {
            customerDetails: data.customerDetails,
            products: data.products,
            prices: data.prices,
            quotationNo: data.quotationNo,
            quotationStatus: data.quotationStatus,
            createdDate: data.createdDate,
            updatedDate: data.updatedDate,
        })

        // Generate PDF buffer in memory
        pdf.create(htmlContent).toBuffer((err, buffer) => {
            if (err) {
                res.status(500).json({ message: 'Failed to generate PDF' });
                return
            }
            const mailOptions = {
                // from: process.env.AUTH_MAIL,
                from: "inbarajan.wizinoa@gmail.com",
                // to: data?.customerDetails?.email,
                to: "karthick.wizinoa@gmail.com",
                subject: `Quotation - ${data.quotationNo}`,
                attachments: [
                    {
                        filename: `quotation-${data.quotationNo}.pdf`,
                        content: buffer,
                        contentType: "application/pdf"
                    }
                ]
            };
            transportor.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    res.status(500).json({ message: "Error in mail sending funciton", error: error })
                    return
                }
                await QuotationMODAL.updateOne({ _id: id }, {
                    $set: {
                        updatedDate: currentDateWithTime(),
                        quotationStatus: "Sent"
                    },
                    $push: {
                        quotationHistory: [{
                            historyCommand: "Quotation Send",
                            historyDate: currentDateWithTime(),
                            historyStatus: 'Sent'
                        }]
                    }
                })
                res.status(200).json({ message: "Quotation send successfully", info })
            })
        })
    };

    convertQuotaionToInvoice: RequestHandler<{ id: string }> = async (req: IGetSingleQuotation, res): Promise<void> => {
        const { id } = req.params;

        const quotation = await QuotationMODAL.findById(id);
        if (!quotation) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not found",
                statusCode: 404,
                success: true,
            };
            res.status(200).json(apiRes);
            return;
        }

        const invoiceCount = await INVOICEMODAL.countDocuments();
        const nextInvoiceCount = (invoiceCount + 1).toString().padStart(3, "0");
        const newInvoiceCount = `Bill${nextInvoiceCount}`;
        const data = await INVOICEMODAL.create({
            customerDetails: quotation.customerDetails,
            prices: quotation.prices,
            products: quotation.products,
            invoiceNo: newInvoiceCount,
            createdDate: currentDateWithTime(),
            updatedDate: currentDateWithTime(),
            quotationStatus: "Draft",
            quotationHistory: [{
                historyCommand: "Quotation Conveted to Invoice ",
                historyDate: currentDateWithTime(),
                historyStatus: 'Approved'
            }]
        })

        const deleteQuotation = await QuotationMODAL.findByIdAndDelete({ _id: id });
        if (!deleteQuotation) {
            const apiRes: IApiResponse<null> = {
                message: "Quotation not found",
                statusCode: 404,
                success: true,
            };
            res.status(200).json(apiRes);
            return;
        }

        res.status(200).json({
            message: "Invoice Converted Successfully",
            statusCode: 201,
            success: true,
            responses: deleteQuotation
        })
    }

}

export default new QuotationClass();