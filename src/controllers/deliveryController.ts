import { NextFunction, Request, RequestHandler, Response } from "express";
import { ICreateDelivery, IDeliveryResponse, IDeliverySchema } from "../@types/deliveryTypes";
import { DELIVERYMODAL } from "../modals/deliverySchema/deliveryModal";
import { IApiResponse } from "../utilities/Responses";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { FilterQuery } from "mongoose";
import { transportor } from "../helper/apiResponse";
import path from "path";
import ejs from "ejs";
import { createError } from "../utilities/createError";
import { INVOICEMODAL } from "../modals/invoiceSchema/invoiceModal";
import { USERMODAL } from "../modals/userSchema/userModal";

class DeliveryController {
    createDelivery: RequestHandler = async (req: ICreateDelivery, res: Response, next: NextFunction): Promise<void> => {
        const { deliveryPersonId, installedDate, invoiceId, status, branchId } = req.body;
        const invoice = await INVOICEMODAL.findById(invoiceId)

        if (!deliveryPersonId || !installedDate || !invoiceId || !status || !branchId) {
            createError("Fill the all required fields!", 400)
        }

        const data = await DELIVERYMODAL.create({
            customerId: invoice?.customerDetails?._id,
            deliveryPersonId,
            installationProof: null,
            installedDate,
            invoiceId,
            status,
            branchId
        })
        if (!data) {
            createError("Delivery not created", 400)
        }

        const populatedData: IDeliveryResponse = await data
            .populate({ path: "customerId deliveryPersonId invoiceId branchId", select: "-__v -createdAt -updatedAt -feedBack -knownVia" })
        const templatePath = path.join(__dirname, "../views/delivery.ejs")
        let htmlTemplate;
        ejs.renderFile(templatePath, {
            branchName: populatedData?.branchId?.branchName,
            branchCity: populatedData?.branchId?.city,
            customerName: populatedData?.invoiceId?.customerDetails?.customerName,
            customerNumber: populatedData?.invoiceId?.customerDetails?.mobile,
            customerAddress: populatedData?.invoiceId?.customerDetails?.address,
            installationDate: populatedData?.installedDate,
            products: populatedData?.invoiceId?.products,
            status: populatedData?.status,
        }, (err, html) => {
            if (err) {
                console.log("Error in rendering EJS template", err)
            } else {
                htmlTemplate = html
            }
        })
        // const deliveryPerson = await USERMODAL.findById(populatedData?.deliveryPersonId)
        const mailOptions = {
            from: "inbarajan.wizinoa@gmail.com",
            // to: deliveryPerson?.email,
            to: "karthick.wizinoa@gmail.com",
            subject: "Delivery Order",
            html: htmlTemplate
        };
        transportor.sendMail(mailOptions, async (error, info) => {
            if (error) {
                res.status(500).json({ message: "Error in mail sending funciton", error: error })
                return
            }
            res.status(200).json({
                message: "Delivery created successfully",
                statuscode: 201,
                success: true,
                responses: populatedData,
                info: info
            })
        })
    }
    getAllDelivery: RequestHandler = async (req: ICreateDelivery, res): Promise<void> => {
        const data = await DELIVERYMODAL.find()
            .populate({ path: "customerId deliveryPersonId invoiceId branchId", select: "-__v -createdAt -updatedAt -feedBack -knownVia" })
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Delivery not found",
                statuscode: 404,
                success: false
            }
            res.status(400).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IDeliverySchema[]> = {
            message: "Delivery get successfully",
            statuscode: 200,
            success: true,
            responses: data
        }
        res.status(201).json(apiRes)
    }
    getSingleDelivery: RequestHandler = async (req: ICreateDelivery, res): Promise<void> => {
        const { id } = req.params;
        const data = await DELIVERYMODAL.findById(id).populate({ path: "customerId deliveryPersonId invoiceId branchId", select: "-__v -createdAt -updatedAt -feedBack -knownVia" })
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "Delivery not found",
                statuscode: 400,
                success: false
            }
            res.status(400).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IDeliverySchema> = {
            message: "Delivery get successfully",
            statuscode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }
    deleteSingleDelivery: RequestHandler = async (req: ICreateDelivery, res): Promise<void> => {
        const { id } = req.params;
        try {
            // Find the delivery document
            const delivery = await DELIVERYMODAL.findById(id);
            if (!delivery) {
                const apiRes: IApiResponse<null> = {
                    message: "Delivery not found",
                    statuscode: 404,
                    success: false
                };
                res.status(404).json(apiRes);
                return;
            }

            const photoUrl = delivery.installationProof;
            if (photoUrl) {
                const publicId = decodeURIComponent(photoUrl.split('/').slice(-2).join('/').split('.')[0]);
                if (publicId) {
                    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
                    console.log('Cloudinary response:', cloudinaryResponse);
                } else {
                    console.error('Failed to extract the public ID from URL.');
                }
            } else {
                console.log('No installationProof URL found in delivery record.');
            }
            const data = await DELIVERYMODAL.findByIdAndDelete(id);
            if (!data) {
                throw new Error('Failed to delete the delivery from the database');
            }
            const populatedData = await data.populate({ path: "customerId deliveryPersonId invoiceId branchId", select: "-__v -createdAt -updatedAt -feedBack -knownVia" })
            // Respond with success
            const apiRes: IApiResponse<IDeliverySchema> = {
                message: "Delivery deleted successfully",
                statuscode: 200,
                success: true,
                responses: populatedData
            };
            res.status(200).json(apiRes);

        } catch (error) {
            console.error('Error during deletion:'); // Log the error for debugging
            const apiRes: IApiResponse<null> = {
                message: "Internal Server Error",
                statuscode: 500,
                success: false
            };
            res.status(500).json(apiRes);
        }
    };
    updateSingleDelivery: RequestHandler = async (req: ICreateDelivery, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { deliveryPersonId, installedDate, invoiceId, branchId, lang, lat } = req.body;
        try {
            // Find the existing delivery document
            const delivery = await DELIVERYMODAL.findById(id);
            if (!delivery) {
                const apiRes: IApiResponse<null> = {
                    message: "Delivery not found",
                    statuscode: 404,
                    success: false
                };
                res.status(404).json(apiRes);
                return;
            }
            const invoice = await INVOICEMODAL.findById(invoiceId)

            // Initialize variables to hold the updated proof URL
            let newInstallationProofUrl = delivery.installationProof;
            let deliveryStatus;

            // If a new file is provided, handle Cloudinary upload
            if (req.file) {
                // Delete the old Cloudinary file (if it exists)
                if (delivery.installationProof) {
                    const oldPhotoUrl = delivery.installationProof;
                    const publicId = decodeURIComponent(oldPhotoUrl.split('/').slice(-2).join('/').split('.')[0]);

                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                }

                // Upload the new file to Cloudinary
                const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "Delivery Proofs" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else if (result) {
                                resolve(result);
                            } else {
                                reject(new Error("Upload failed with no result"));
                            }
                        }
                    );
                    uploadStream.end(req.file?.buffer);
                });

                if (!uploadResult) {
                    throw new Error("Failed to upload new installation proof");
                }
                newInstallationProofUrl = uploadResult.secure_url;
                deliveryStatus = "Completed";
            }

            const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${process.env.LOCAIONT_TOKEN}&lat=${lat}&lon=${lang}&format=json&`);
            const data = await response.json()
            // Update the delivery document with new data
            const updatedDelivery = await DELIVERYMODAL.findByIdAndUpdate(
                id,
                {
                    customerId: invoice?.customerDetails?._id,
                    deliveryPersonId,
                    installationProof: newInstallationProofUrl,
                    installedDate,
                    invoiceId,
                    status: deliveryStatus,
                    branchId,
                    geoLocation: data
                },
                { new: true }
            );
            console.log(updatedDelivery)
            // Populate any necessary fields for the updated document
            const populatedData = await updatedDelivery
                ?.populate({ path: "customerId deliveryPersonId invoiceId Branch", select: "-__v -createdAt -updatedAt -feedBack -knownVia" });

            // Respond with success
            const apiRes: IApiResponse<IDeliverySchema> = {
                message: "Delivery updated successfully",
                statuscode: 200,
                success: true,
                responses: populatedData
            };
            res.status(200).json(apiRes);

        } catch (error) {
            next(error)
        }
    };
    searchDeliverys: RequestHandler = async (req: Request, res): Promise<void> => {
        const { search, page = 1, limit = 10, userId } = req.query;
        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const query: FilterQuery<IDeliveryResponse> = {};
            let role;
            if (userId) {
                const userType = await USERMODAL.findById(userId);
                role = userType?.userType;
            }
            if (role === "Delivery") {
                query['deliveryPersonId.userType'] = "Delivery"
            } else if (role === "Manager") {
                query['deliveryPersonId.userType'] = "Manager"
            } else if (role === "Employee") {
                query["deliveryPersonId.userType"] = "Employee"
            } else if (role === "Admin") {
            } else {
                throw createError("User type not match", 400)
            }
            if (search) {
                query.$or = [
                    { "deliveryPersonId.firstName": { $regex: search, $options: "i" } },
                    { "deliveryPersonId.lastName": { $regex: search, $options: "i" } },
                    { "invoiceId.invoiceNo": { $regex: search, $options: "i" } }
                ]
            }
            const deliverys = await DELIVERYMODAL.find(query).skip(skip).limit(limitNumber)
                .populate({
                    path: "customerId deliveryPersonId invoiceId branchId",
                    select: "-__v -createdAt -updatedAt -feedBack -knownVia"
                });
            const totalDeliverys = await DELIVERYMODAL.countDocuments(query);
            console.log(deliverys)
            res.status(200).json({
                message: "Delivery fetch successfully",
                statusCode: 200,
                success: true,
                responses: {
                    role,
                    deliverys,
                    pagination: {
                        currentPage: pageNumber,
                        totalPages: Math.ceil(totalDeliverys / limitNumber),
                        totalDeliverys,
                    },
                },
            });
        } catch (error) {
            const apiRes: IApiResponse<null> = {
                message: "Internal server error",
                statuscode: 500,
                success: false,
                error: (error as Error).message || String(error)
            }
            res.status(500).json(apiRes)
        }
    }
}

export default new DeliveryController();