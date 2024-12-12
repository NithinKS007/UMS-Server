import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { hashPassword } from "../../shared/utils/hash.password";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { CreateUserUseCase } from "../../application/usecase/create.user.usecase";
import { FindUserByEmailUseCase } from "../../application/usecase/find.user.by.email.usecase";
import { SigninUserUseCase } from "../../application/usecase/signin.user.usecase";
import { IuserAuthInfoRequest } from "../../application/dto/user.dto";
import {
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../../infrastructure/auth/jwt.service";

const userRepository = new MongoUserRepository();
const createUser = new CreateUserUseCase(userRepository);
const findUserByEmail = new FindUserByEmailUseCase(userRepository);
const signinuser = new SigninUserUseCase(userRepository);

export class AuthController {
  static async signup(req: IuserAuthInfoRequest, res: Response): Promise<void> {
    try {
      const existingUser = await findUserByEmail.execute(req.body.email);
      if (existingUser) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          existingUser,
          "Email already exists"
        );
        return;
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await createUser.execute({
        ...req.body,
        password: hashedPassword,
      });

      const userData = user.toObject();
      sendResponse(
        res,
        HTTP_STATUS_CODES.CREATED,
        { userData: userData },
        "User created successfully"
      );
    } catch (error) {
      console.log(`Error in  signup : ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to create user. Please try again"
      );
    }
  }

  static async signin(req: IuserAuthInfoRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await signinuser.execute({ email, password });

      if (!user) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          null,
          "Invalid user data"
        );
        return;
      }

      if (!user.id || !user.role) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          null,
          "Invalid user data"
        );
        return;
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000, // 1 hour expiry
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 86400000, // 1 day expiry
      });

      const userData = user.toObject();
      delete userData.password;

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        { userData: userData },
        "Login successful"
      );
    } catch (error) {
      console.log(`Error in signin : ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to sign in. Please try again"
      );
    }
  }
  static async signout(req: IuserAuthInfoRequest, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      console.log("after clearing cookie");
      sendResponse(res, HTTP_STATUS_CODES.ok, null, "Logout successful");
    } catch (error) {
      console.log(`Error in signout : ${error}`);
      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to logout, Please try again"
      );
    }
  }

  static generateRefreshToken = (req: IuserAuthInfoRequest, res: Response): void => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.BAD_REQUEST,
        null,
        "No refresh token provided"
      );
      return;
    }

    try {
      const decoded = authenticateRefreshToken(refreshToken)

      const newAccessToken = generateAccessToken(decoded.id, decoded.role) ;

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        null,
        "Access token refreshed successfully"
      );
    } catch (error) {
      console.log(`Error in generateRefreshToken ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.BAD_REQUEST,
        null,
        "Invalid or expired refresh token"
      );
    }
  };
}
