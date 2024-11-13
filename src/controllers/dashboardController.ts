import { Request, RequestHandler, Response } from "express";
import { INVOICEMODAL } from "../modals/invoiceSchema/invoiceModal";
import { LEADMODAL } from "../modals/leadSchema/leadModal";
import { CUSTOMERMODAL } from "../modals/customerSchema/customerModal";


class DashboardClass {
    totalSummary: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            // Get total leads and customers
            const totalLeads = await LEADMODAL.countDocuments();
            const totalCustomer = await CUSTOMERMODAL.countDocuments();
            const totalInvoice = await INVOICEMODAL.find();

            let totalAmount: number = 0;
            let totalQuantity: number = 0;

            totalInvoice.forEach((item) => {
                item.products.forEach(product => {
                    totalQuantity += product?.quentity;
                });
                totalAmount += item?.prices?.total;
            });

            // Send response with totals
            res.status(200).json({
                message: "Data fetched successfully",
                statusCode: 200,
                responses: {
                    totalAmount,
                    totalQuantity,
                    totalLeads,
                    totalCustomer
                }
            });

        } catch (error: unknown) {
            res.status(500).json({
                message: "Internal error occurred",
                statusCode: 500,
                error: (error as Error).message || String(error)
            });
        }
    };
}

export default new DashboardClass()