import { RequestHandler } from "express";
import { IBulkUpload, ICreateLead, IGetSingleLead, IMultipleLead, ISearchLead, ITodayLeads } from "../@types/leadTypes";
import { LEADMODAL, ILead } from "../modals/leadSchema/leadModal";
import { currentDateWithTime, IApiResponse } from "../helper/apiResponse";
import mongoose, { FilterQuery } from "mongoose";
import XLSX from 'xlsx'
import { IBranch } from "../modals/branchSchema/branchModal";

interface IOutLeads {
    date: Date,
    customerName: string,
    mobile: string,
    email: string,
    leadId: string,
    address: string,
    knownVia: string,
    updatedOn: Date,
    remainder: Date,
    status: string,
    suggestion: string,
    branch: IBranch,
}

class LeadsClass {

    createLead: RequestHandler = async (req: ICreateLead, res): Promise<void> => {
        const { address, branch, customerName, email, remainder, knownVia, mobile, status, suggestion } = req.body;
        const leadCount = await LEADMODAL.countDocuments();
        const nextLeadNumber = (leadCount + 1).toString().padStart(3, "0");
        const newLeadId = `LED${nextLeadNumber}`;

        const createData = await LEADMODAL.create({
            address,
            branch,
            leadId: newLeadId,
            customerName,
            date: currentDateWithTime(),
            email,
            remainder: currentDateWithTime(remainder),
            knownVia,
            mobile,
            status,
            suggestion,
            updatedOn: currentDateWithTime()
        })

        const data = await LEADMODAL.findById(createData._id).populate({ path: 'branch', select: "branchName _id branchId" });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Lead not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ILead> = {
            message: "Lead created successfully",
            statusCode: 201,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)
    }

    getSingleLead: RequestHandler<{ id: string }> = async (req: IGetSingleLead, res): Promise<void> => {
        const { id } = req.params;
        const data = await LEADMODAL.findById(id).populate({ path: 'branch', select: "branchName _id branchId" });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Lead not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ILead> = {
            message: "Lead fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)


    }

    getAllLead: RequestHandler = async (req: ICreateLead, res): Promise<void> => {
        const data = await LEADMODAL.find().populate({ path: 'branch', select: "branchName _id branchId" }).sort({ createdAt: -1 });
        const apiRes: IApiResponse<ILead[]> = {
            message: "Data fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    deleteLead: RequestHandler<{ id: string }> = async (req: IGetSingleLead, res): Promise<void> => {
        const { id } = req.params;
        const data = await LEADMODAL.findByIdAndDelete(id);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Lead not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ILead> = {
            message: "Lead deleted successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    updateLead: RequestHandler<{ id: string }> = async (req: IGetSingleLead, res): Promise<void> => {
        const { id } = req.params;
        const data = await LEADMODAL.findByIdAndUpdate(id, req.body, { new: true }).populate({ path: 'branch', select: "branchName _id branchId" });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Lead not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<ILead> = {
            message: "Lead update successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    searchLead: RequestHandler = async (req: ISearchLead, res): Promise<void> => {
        const { search, limit = 10, page = 1 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: FilterQuery<ILead> = {};

        if (search) {
            query.$or = [
                { leadId: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            ]
        }

        const leads = await LEADMODAL.
            find(query).
            skip(skip).
            limit(limitNumber)
            .populate({ path: 'branch', select: "branchName _id branchId" })
            .sort({ createdAt: -1 })
        const totalLeads = await LEADMODAL.countDocuments(query);
        res.status(200).json({
            message: "Branch fetch successfully",
            statusCode: 200,
            success: true,
            responses: {
                leads,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalLeads / limitNumber),
                    totalLeads,
                },
            },
        });
    }

    multipleDelete: RequestHandler = async (req: IMultipleLead, res): Promise<void> => {
        const { ids } = req.body;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ message: "No valid IDs provided", success: false })
                return
            }
            const data = await LEADMODAL.deleteMany({ _id: { $in: ids } });

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

    bulkUpload: RequestHandler = async (req: IBulkUpload, res): Promise<void> => {
        const { leads } = req.body;
        try {
            if (!Array.isArray(leads)) {
                res.status(400).json({
                    message: "Input data must be an array",
                    statusCode: 400,
                    success: false,
                });
                return
            }
            const leadCount = await LEADMODAL.countDocuments();
            const nextLeadNumber = (leadCount + 1).toString().padStart(3, "0");
            const newLeadId = `LED${nextLeadNumber}`

            const updatedLeads = leads.map((item) => {
                item.date = currentDateWithTime(),
                    item.updatedOn = currentDateWithTime(),
                    item.leadId = newLeadId
            })
            const data = await LEADMODAL.insertMany(leads)
            const apiRes: IApiResponse<ILead[]> = {
                message: "Leads created successfully",
                statusCode: 201,
                success: true,
                responses: leads,
            };

            res.status(201).json(apiRes);
        } catch (error: unknown) {
            const apiRes: IApiResponse<null> = {
                message: "Internal error occured",
                statusCode: 500,
                success: false,
                error: (error as Error).message || String(error)
            };
            res.status(500).json(apiRes);
        }
    }

    todayLeads: RequestHandler<any, any, any, { today: string }> = async (req: ITodayLeads, res): Promise<void> => {
        const { today } = req.query;
        try {
            if (!today) {
                res.status(400).json({
                    message: "Date is required",
                    statusCode: 400,
                    success: false
                });
                return
            }

            const formattedDate = currentDateWithTime(today);
            const query: FilterQuery<ILead> = { remainder: formattedDate };

            const data = await LEADMODAL.find(query).populate({
                path: 'branch',
                select: "branchName _id branchId"
            })
            res.status(200).json({
                message: "Leads fetched successfully",
                statusCode: 200,
                success: true,
                responses: data
            });

        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Internal server error",
                statusCode: 500,
                success: false
            };
            res.status(500).json(apiRes);
        }
    };

    exportLeads: RequestHandler = async (req: IMultipleLead, res): Promise<void> => {
        const { ids } = req.body;

        try {
            if (!ids || !Array.isArray(ids)) {
                res.status(400).json({
                    message: "Input data must be an array",
                    statusCode: 400,
                    success: false,
                });
                return
            }
            const objectId = ids.map(id => mongoose.Types.ObjectId.isValid(id) ? id : null).filter(Boolean);
            if (objectId.length === 0) {
                res.status(200).json({
                    message: "Invalid ids provided",
                    statusCode: 200,
                    success: false
                })
                return
            }

            const leads = await LEADMODAL.find({ _id: { $in: objectId } })
                .populate('branch', 'branchName branchId');

            const data = leads.map((item, i) => ({
                "S.No": i + 1,
                "Date": item.date,
                "Customer Name": item.customerName,
                "Mobile": item.mobile,
                "Email": item.email,
                "Lead Id": item.leadId,
                "Address": item.address,
                "Lead Source": item.knownVia,
                "Updated On": item.updatedOn,
                "Remainder": item.remainder,
                "Status": item.status,
                "Enquire": item.suggestion,
            }))

            // Workbook creations
            const workBook = XLSX.utils.book_new();
            const workSheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workBook, workSheet, "Leads")

            const excelBuffer = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })

            res.setHeader("Content-Disposition", 'attachment; filename="leads.xlsx"');
            res.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer)

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', statusCode: 500, success: false, error: error });
        }
    }
}
export default new LeadsClass();