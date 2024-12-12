import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { FindUserByIdUseCase } from "../../application/usecase/find.user.by.id.usecase";
import { UpdateUserUseCase } from "../../application/usecase/update.user.usecase";
import { IuserAuthInfoRequest } from "../../application/dto/user.dto";

const userRepository = new MongoUserRepository();
const getuserProfile = new FindUserByIdUseCase(userRepository);
const updateuserProfile = new UpdateUserUseCase(userRepository);

export class UserController {
  static async getuserProfile(req: IuserAuthInfoRequest, res: Response): Promise<void> {
    const user = req.user;
    try {
      if (!user) {
        sendResponse(res, HTTP_STATUS_CODES.FORBIDDEN, null, "Access denied");
        return;
      }

      const userDetails = await getuserProfile.execute(user.id);

      if (!userDetails) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "User not found");

        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        userDetails,
        "User data retrieved"
      );
    } catch (error) {
      console.log(`Error in retrieving user details ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Cannot retrieve user details"
      );
    }
  }

  static async updateuserProfile(req: IuserAuthInfoRequest, res: Response): Promise<void> {
    try {
      const user = req.user;

      const userData = req.body;

      if (!user) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "Access denied");

        return;
      }

      const updateduser = await updateuserProfile.execute(userData, user.id);

      if (!updateduser) {
        sendResponse(res, HTTP_STATUS_CODES.FORBIDDEN, null, "user not found");

        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        updateduser,
        "user updated success"
      );
    } catch (error) {
      console.log(`Error in updating user details ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to update user details"
      );
    }
  }
}
