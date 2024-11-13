import { NextFunction, Request, Response } from "express";
import { IUser, USERMODAL } from "../modals/userSchema/userModal";
import { IApiResponse } from "../../src/utilities/Responses";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { createError } from "../utilities/createError";
import { generateVerificationToken } from "../utilities/generateTokens";
import { transportor } from "../helper/apiResponse";
import ejs from 'ejs';
import path from "path";

interface IDecodedToken {
  userId: ObjectId,
  password?: string,
  userType: string,
  profile: string,
  firstName: string,
  lastName: string,
  branch: ObjectId,
  mobile: string,
  email: string,
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      const apiRes: IApiResponse<null> = {
        message: "Token Not found!",
        statuscode: 401,
        success: false,
      };
      return res.status(401).json(apiRes);
    }

    const decode = jwt.verify(token, process.env.JWT_KEY as string)
    next();
  } catch (error: unknown) {
    const apiRes: IApiResponse<null> = {
      message: "Internal Server Error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiRes);
  }
};

export const SignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const findUser = await USERMODAL.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (!findUser) {
      const apiErrRes: IApiResponse<null> = {
        message: "User not found!",
        statuscode: 404,
        success: false,
      };

      return res.status(404).json(apiErrRes);
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      const apiErrRes: IApiResponse<null> = {
        message: "Incorrect password!",
        statuscode: 401,
        success: false,
      };

      return res.status(401).json(apiErrRes);
    }

    // Generate JWT Token
    const jwtToken = jwt.sign(
      {
        userId: findUser._id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
        mobile: findUser.mobile,
        userType: findUser.userType,
        profile: findUser.profile,
        branch: findUser.branch,
      },
      process.env.JWT_KEY || "jsonkey",
      { expiresIn: "1d" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,              // Prevents client-side scripts from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
      sameSite: 'strict',          // Helps protect against CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
    );
    // Send a response to the client
    const apiRes: IApiResponse<IDecodedToken> = {
      message: `Welcome ${findUser.firstName}`,
      statuscode: 200,
      success: true,
      responses: {
        userId: findUser._id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
        mobile: findUser.mobile,
        userType: findUser.userType,
        profile: findUser.profile,
        branch: findUser.branch,
      },
    };

    res.status(200).json(apiRes);
  } catch (error) {
    const apiErrRes: IApiResponse<null> = {
      message: "Internal server error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiErrRes);
  }
};

export const Logout = async (req: Request, res: Response) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      const apiErrRes: IApiResponse<null> = {
        message: "Token Not found",
        success: false,
        statuscode: 400,
      };

      return res.status(400).json(apiErrRes);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });

    const apiRes: IApiResponse<IUser> = {
      message: "Bye Bye",
      statuscode: 200,
      success: true,
    };
    res.status(200).json(apiRes);
  } catch (error) {
    const apiErrRes: IApiResponse<null> = {
      message: "Internal server error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiErrRes);
  }
};

export const welcome = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome",
    statusCode: 200,
    status: true
  })
}

export const tokenDecoder = async (req: Request, res: Response) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      const apiRes: IApiResponse<null> = {
        message: "Token Not found!",
        statuscode: 401,
        success: false,
      };
      return res.status(401).json(apiRes);
    }
    const decode = jwt.verify(token, process.env.JWT_KEY || "jsonkey") as IDecodedToken;
    const data = await USERMODAL.findById(decode.userId);
    if (!data) {
      const apiRes: IApiResponse<null> = {
        message: "Access denied. You don't have permission.",
        statuscode: 401,
        success: false,
      };
      return res.status(401).json(apiRes);
    }
    const apiRes: IApiResponse<IDecodedToken> = {
      message: "Welcome user",
      statuscode: 200,
      success: true,
      responses: decode
    }
    res.status(200).json(apiRes)
  } catch (error: unknown) {
    const apiRes: IApiResponse<null> = {
      message: "Internal Server Error",
      statuscode: 500,
      success: false,
      error: (error as Error).message || String(error),
    };
    res.status(500).json(apiRes);
  }
}

export const verifyEmailSend = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await USERMODAL.findById(userId)
    if (!user) {
      throw createError("User not found!", 404);
    }
    const verifyToken = generateVerificationToken(user._id);
    const veryfyUrl = `${process.env.REACT_APP_API_URL}/verifycation/verify-email?token=${verifyToken}`;
    const updatedUser = await USERMODAL.findByIdAndUpdate(user._id, { verificationToken: verifyToken });
    if (!updatedUser) {
      throw createError("User didn't updated", 400)
    }

    const templatePath = path.join(__dirname, "../views/verifycation.ejs")
    let htmlTemplate;

    ejs.renderFile(templatePath, {
      branchName: user?.branch,
      customerName: user?.firstName,
      verificationToken: veryfyUrl
    }, (err, html) => {
      if (err) {
        console.log("Error in rendering EJS template", err)
      } else {
        htmlTemplate = html
      }
    })

    const mailOptions = {
      from: "inbarajan.wizinoa@gmail.com",
      // to: deliveryPerson?.email,
      to: "karthick.wizinoa@gmail.com",
      subject: "Verification Mail",
      html: htmlTemplate
    };
    transportor.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error in mail sending funciton", error: error })
      }
      res.status(200).json({
        message: "Verify email send successfully",
        statuscode: 201,
        success: true,
        token: verifyToken,
        mailInfo: info
      })
    })

  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { verifyToken } = req.query;
  try {
    const decode = jwt.verify(verifyToken as string, process.env.JWT_KEY!) as { userId: string };
    const user = await USERMODAL.findById(decode.userId);
    console.log({ verifyToken, decode, user })
    if (!user || user.verificationToken !== verifyToken) {
      throw createError("Not a valid link", 401)
    }
    user.isValidEmail = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({
      message: "Email verified successfully",
      success: true,
      statusCode: 200
    })
  } catch (error) {
    next(error)
  }
}



// export const protect = (req: Request, res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

// export const roleCheck = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     if (!roles.includes(req.user.role)) {
//       res.status(403).json({ message: 'Access denied' });
//       return;
//     }
//     next();
//   };
// };