import { USERMODAL, IUser } from '../modals/userSchema/userModal';
import { currentDateWithTime, IApiResponse } from '../helper/apiResponse';
import { hash } from 'bcrypt';
import { RequestHandler } from 'express-serve-static-core';
import { ICreateUser, IGetSingleUser, IMultipleUser, ISearchUser } from '../@types/userTypes';
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { FilterQuery } from 'mongoose';

class userController {

    createUser: RequestHandler = async (req: ICreateUser, res): Promise<void> => {

        const { address, branch, firstName, password, lastName, userType, email, dob, doj, mobile, salary, gender } = req.body;
        if (req.file) {
            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "User" },
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

            const hashedPassword = await hash(password, 10);

            const data = await USERMODAL.create({
                firstName,
                lastName,
                address,
                mobile,
                branch,
                email,
                gender,
                userType,
                password: hashedPassword,
                salary,
                dob: currentDateWithTime(dob),
                doj: currentDateWithTime(doj),
                profile: uploadResult.secure_url
            })
            const apiRes: IApiResponse<IUser> = {
                message: "User created successfully",
                statusCode: 201,
                success: true,
                responses: data
            }
            res.status(201).json(apiRes)
        }


    }

    getSingleUser: RequestHandler<{ id: string }> = async (req: IGetSingleUser, res): Promise<void> => {
        const { id } = req.params;
        const data = await USERMODAL.findById(id).populate({ path: 'branch', select: "-createdAt -updatedAt -__v" });
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "User not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IUser> = {
            message: "User fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)


    }

    getAllUser: RequestHandler = async (req: ICreateUser, res): Promise<void> => {
        const data = await USERMODAL.find().populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).sort({ createdAt: -1 });
        const apiRes: IApiResponse<IUser[]> = {
            message: "Data fetch successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    deleteUser: RequestHandler<{ id: string }> = async (req: IGetSingleUser, res): Promise<void> => {
        const { id } = req.params;

        const user = await USERMODAL.findById(id);
        if (!user) {
            const apiRes: IApiResponse<null> = {
                message: "User not foudn",
                statusCode: 404,
                success: false,
            }
            res.status(404).json(apiRes)
            return
        }
        // Assuming the user document has a field called `photo` for the Cloudinary image URL
        const photoUrl = user?.profile;

        // Extract the publicId from the photo URL (removing the Cloudinary URL and file extension)
        const publicId = photoUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract 'StaffsProfiles/cesaoec1xllow2q3dkwf'

        // Delete the user record from the database
        const data = await USERMODAL.findByIdAndDelete(id);

        if (publicId) {
            // Delete the associated file in Cloudinary using the extracted publicId
            await cloudinary.uploader.destroy(publicId);
        }
        if (!data) {
            const apiRes: IApiResponse<null> = {
                message: "User not found",
                statusCode: 404,
                success: false
            }
            res.status(404).json(apiRes)
            return
        }
        const apiRes: IApiResponse<IUser> = {
            message: "User deleted successfully",
            statusCode: 200,
            success: true,
            responses: data
        }
        res.status(200).json(apiRes)
    }

    updateUser: RequestHandler<{ id: string }> = async (req: IGetSingleUser, res): Promise<void> => {
        const { id } = req.params;
        const { userName, ...otherFields } = req.body;

        // Find the existing user document
        const user = await USERMODAL.findById(id);
        if (!user) {
            const apiRes: IApiResponse<null> = {
                message: "User not found",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        // Initialize variables to hold the updated proof URL
        let newInstallationProofUrl = user?.profile;

        // If a new file is provided, handle Cloudinary upload
        if (req.file) {
            // Delete the old Cloudinary file (if it exists)
            if (user?.profile) {
                const oldPhotoUrl = user?.profile;
                const publicId = decodeURIComponent(oldPhotoUrl.split('/').slice(-2).join('/').split('.')[0]);

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Upload the new file to Cloudinary
            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "User" },
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
        }
        const updatedData = {
            userName,
            photo: newInstallationProofUrl,
            ...otherFields
        };

        const uploadUser = await USERMODAL.findByIdAndUpdate(id, updatedData, { new: true });
        if (!uploadUser) {
            const apiRes: IApiResponse<null> = {
                message: "Staff not updated",
                statusCode: 404,
                success: false,
            };
            res.status(404).json(apiRes);
            return;
        }
        const apiRes: IApiResponse<IUser> = {
            message: "User update successfully",
            statusCode: 200,
            success: true,
            responses: uploadUser
        }
        res.status(200).json(apiRes)
    }

    searchUser: RequestHandler = async (req: ISearchUser, res): Promise<void> => {
        const { search, limit = 10, page = 1 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query: FilterQuery<IUser> = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            ]
        }

        const users = await USERMODAL.
            find(query).
            skip(skip).
            limit(limitNumber).
            populate({ path: 'branch', select: "-createdAt -updatedAt -__v" }).
            sort({ createdAt: -1 })
        const totalUsers = await USERMODAL.countDocuments(query);
        res.status(200).json({
            message: "User fetch successfully",
            statusCode: 200,
            success: true,
            responses: {
                users,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalUsers / limitNumber),
                    totalUsers,
                },
            },
        });
    }

    multipleDelete: RequestHandler = async (req: IMultipleUser, res): Promise<void> => {
        const { ids } = req.body;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ message: "No valid IDs provided", success: false })
                return
            }
            const data = await USERMODAL.deleteMany({ _id: { $in: ids } });

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

export default new userController();
