import { RequestHandler } from "express";
import { ICreateEmployee, IGetSingleEmployee, IMultipleEmployee, ISearchEmployee } from "../@types/employeeTypes";
import { EMPLOYEEMODAL, IEmployee } from "../modals/employeeSchema/employeeModal";
import { currentDateWithTime, IApiResponse } from "../helper/apiResponse";
import { FilterQuery } from "mongoose";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

class EmployeesClass {

    private populatedData = { path: 'branch', select: "-createdAt -updatedAt -__v" }

    createEmployee: RequestHandler = async (req: ICreateEmployee, res): Promise<void> => {

        const { address, branch, employeeName, email, dob, doj, mobile, salary } = req.body;
        const employeeCount = await EMPLOYEEMODAL.countDocuments();
        const nextEmployeeNumber = (employeeCount + 1).toString().padStart(3, "0");
        const newEmployeeId = `EMP${nextEmployeeNumber}`;

        if (req.file) {
            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "Employee" },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else if (result) {
                            resolve(result)
                        } else {
                            reject(new Error("Upload failed with no result"))
                        }
                    }
                )
                uploadStream.end(req.file?.buffer)

            });
            if (!uploadResult) {
                throw new Error("Upload failed, Problem in img uplaod file")
            }
            const data = await EMPLOYEEMODAL.create({
                employeeName,
                employeeId: newEmployeeId,
                address,
                mobile,
                branch,
                email,
                salary,
                dob: currentDateWithTime(dob),
                doj: currentDateWithTime(doj),
                idProof: uploadResult.secure_url
            })
            const populatedData = await data.populate(this.populatedData)
            res.status(201).json({
                message: "Employee created successfully",
                statusCode: 201,
                success: true,
                responses: populatedData
            })
        }


    }

    getSingleEmployee: RequestHandler<{ id: string }> = async (req: IGetSingleEmployee, res): Promise<void> => {
        const { id } = req.params;
        const data = await EMPLOYEEMODAL.findById(id).populate(this.populatedData);
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Employee not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IEmployee> = {
            message: "Employee fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)


    }

    getAllEmployee: RequestHandler = async (req: ICreateEmployee, res): Promise<void> => {
        const data = await EMPLOYEEMODAL.find().populate(this.populatedData).sort({ createdAt: -1 });
        const apiRes: IApiResponse<IEmployee[]> = {
            message: "Data fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    deleteEmployee: RequestHandler<{ id: string }> = async (req: IGetSingleEmployee, res): Promise<void> => {
        const { id } = req.params;

        const employee = await EMPLOYEEMODAL.findById(id);
        if (!employee) {
            const apiRes: IApiResponse<null> = {
                message: "Employee not foudn",
                statusCode: 404,
                success: false,
            }
            res.status(404).json(apiRes)
            return
        }
        // Assuming the employee document has a field called `photo` for the Cloudinary image URL
        const photoUrl = employee?.idProof;

        // Extract the publicId from the photo URL (removing the Cloudinary URL and file extension)
        const publicId = photoUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract 'StaffsProfiles/cesaoec1xllow2q3dkwf'

        // Delete the employee record from the database
        const data = await EMPLOYEEMODAL.findByIdAndDelete(id);

        if (publicId) {
            // Delete the associated file in Cloudinary using the extracted publicId
            await cloudinary.uploader.destroy(publicId);
        }
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Employee not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IEmployee> = {
            message: "Employee deleted successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    updateEmployee: RequestHandler<{ id: string }> = async (req: IGetSingleEmployee, res): Promise<void> => {
        console.log(req.body)
        const { id } = req.params;
        const { employeeName, ...otherFields } = req.body;

        // Find the existing employee document
        const employee = await EMPLOYEEMODAL.findById(id);
        if (!employee) {
            const apiRes: IApiResponse<null> = {
                message: "Employee not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const oldPhotoUrl = employee.idProof;
        const oldPublicId = oldPhotoUrl.split('/').slice(-2).join('/').split('.')[0];

        let newPhotoUrl = oldPhotoUrl;
        if (req.file) {
            if (oldPublicId) {
                await cloudinary.uploader.destroy(oldPublicId);
            }
            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "Employee" },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else if (result) {
                            resolve(result)
                        } else {
                            reject(new Error("Upload failed with no result"))
                        }
                    }
                );
                uploadStream.end(req.file?.buffer)
            })
            newPhotoUrl = uploadResult.secure_url;
        }
        const updatedData = {
            employeeName,
            photo: newPhotoUrl,
            ...otherFields
        };

        const uploadEmployee = await EMPLOYEEMODAL.findByIdAndUpdate(id, updatedData, { new: true });
        if (!uploadEmployee) {
            const apiRes: IApiResponse<null> = {
                message: "Staff not updated",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const populateDate = await uploadEmployee.populate(this.populatedData)
        res.status(200).json({
            message: "Employee update successfully",
            statusCode: 200,
            success: true,
            responses: populateDate
        })
    }

    searchEmployee: RequestHandler = async (req: ISearchEmployee, res): Promise<void> => {
        const { search, limit = 10, page = 1 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: FilterQuery<IEmployee> = {};

        if (search) {
            query.$or = [
                { employeeId: { $regex: search, $options: "i" } },
                { employeeName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            ]
        }

        const employees = await EMPLOYEEMODAL.
            find(query).
            skip(skip).
            limit(limitNumber).
            populate(this.populatedData).
            sort({ createdAt: -1 })
        const totalEmployees = await EMPLOYEEMODAL.countDocuments(query);
        res.status(200).json({
            message: "Employee fetch successfully",
            statusCode: 200,
            success: true,
            responses: {
                employees,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalEmployees / limitNumber),
                    totalEmployees,
                },
            },
        });
    }

    multipleDelete: RequestHandler = async (req: IMultipleEmployee, res): Promise<void> => {
        const { ids } = req.body;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ message: "No valid IDs provided", success: false })
                return
            }
            const data = await EMPLOYEEMODAL.deleteMany({ _id: { $in: ids } });

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
export default new EmployeesClass();