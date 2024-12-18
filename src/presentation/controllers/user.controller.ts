import { Response } from "express";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { UpdateUserUseCase } from "../../application/usecase/update.user.usecase";
import { IuserAuthInfoRequest } from "../../application/dto/user.dto";
import {uploadImage} from "../../shared/utils/cloudinary";

const userRepository = new MongoUserRepository();
const updateuserProfile = new UpdateUserUseCase(userRepository);

export class UserController {

  static async updateuserProfile(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = req.user;

      const userData = req.body;

      console.log("data for updating",userData);
      

      if (!user) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "Access denied");

        return;
      }
      if (userData.imageUrl) {
        const cloudinaryurl = await uploadImage({
          image: userData.imageUrl,
          folder: "user-management-react-nodejs/user",
        });
        userData.imageUrl = cloudinaryurl;
      }

      const updateduser = await updateuserProfile.execute(user.id, userData);

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
