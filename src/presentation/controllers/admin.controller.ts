import { Response } from "express";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { FindUserByIdUseCase } from "../../application/usecase/find.user.by.id.usecase";
import { UpdateUserUseCase } from "../../application/usecase/update.user.usecase";
import { FindallUsersUseCase } from "../../application/usecase/find.all.users.usecase";
import { DeleteUserUseCase } from "../../application/usecase/delete.user.usecase";
import { IuserAuthInfoRequest } from "../../application/dto/user.dto";
import { SearchuserUseCase } from "../../application/usecase/search.user.usecase";
import { blockunblockUserUseCase } from "../../application/usecase/blockunblock.usecase";
import { deleteImage, uploadImage } from "../../shared/utils/cloudinary";
import { CreateUserUseCase } from "../../application/usecase/create.user.usecase";
import { hashPassword } from "../../shared/utils/hash.password";
import { FindUserByEmailUseCase } from "../../application/usecase/find.user.by.email.usecase";

const adminRepository = new MongoUserRepository();
const findallUsers = new FindallUsersUseCase(adminRepository);
const getuserDetails = new FindUserByIdUseCase(adminRepository);
const updateuserProfile = new UpdateUserUseCase(adminRepository);
const deleteuser = new DeleteUserUseCase(adminRepository);
const searchuser = new SearchuserUseCase(adminRepository);
const updateUserBlock = new blockunblockUserUseCase(adminRepository);
const createUser = new CreateUserUseCase(adminRepository);
const findUserByEmail = new FindUserByEmailUseCase(adminRepository);

export class AdminController {
  static async findallUsers(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const usersData = await findallUsers.execute();

      if (!usersData) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "No users found");
        return;
      }

      const usersOnlyList = usersData.filter((user) => user.role !== "admin");

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        usersOnlyList,
        "All users retrieved successfully"
      );
    } catch (error) {
      console.log(`Error in retrieving all user details ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to retrieve users list"
      );
    }
  }

  static async getUserProfile(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          null,
          "user id is required"
        );

        return;
      }

      const userDetails = await getuserDetails.execute(id);

      if (!userDetails) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "user not found");
        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        userDetails,
        "user data fetched successfully"
      );
    } catch (error) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to fetch user details"
      );
    }
  }
  static async updateuserDetails(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updatedUserData = req.body;

      if (!id) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          null,
          "User id required"
        );
        return;
      }

      if (updatedUserData.imageUrl) {
        const userDetails = await getuserDetails.execute(id);

        if (userDetails && userDetails.imageUrl) {
          await deleteImage(userDetails.imageUrl);
        }

        const cloudinaryUrl = await uploadImage({
          image: updatedUserData.imageUrl,
          folder: "user-management-react-nodejs/user",
        });

        updatedUserData.imageUrl = cloudinaryUrl;
      }

      const updatedUser = await updateuserProfile.execute(id, updatedUserData);

      if (!updatedUser) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.NOT_FOUND,
          null,
          "User not found or update failed"
        );
        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        updatedUser,
        "User data updated successfully"
      );
    } catch (error) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to update user"
      );
    }
  }

  static async deleteuser(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = req.params;

      if (!user) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.NOT_FOUND,
          null,
          "user id required"
        );

        return;
      }

      const userDetails = await getuserDetails.execute(user.id);

      if (!userDetails) {
        if (!userDetails) {
          sendResponse(
            res,
            HTTP_STATUS_CODES.NOT_FOUND,
            null,
            "User not found"
          );
          return;
        }
      }

      if (userDetails.imageUrl) {
        await deleteImage(userDetails.imageUrl);
      }
      const deleteduserDetails = await deleteuser.execute(user.id);

      if (!deleteduserDetails) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.NOT_FOUND,
          null,
          "User data not found or already deleted"
        );
        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        deleteduserDetails,
        "User data deleted successfully"
      );
    } catch (error) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to delete user"
      );
    }
  }

  static async searchuser(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const searchQuery = req.query as { [key: string]: string };

      const usersData = await searchuser.execute(searchQuery);

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        usersData,
        "users data fetched successfully"
      );
    } catch (error) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Error while searching user"
      );
    }
  }

  static async updateUserBlockStatus(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = req.params;
      const blockStatus = req.body.blockStatus;

      if (!user) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.NOT_FOUND,
          null,
          "user id is required"
        );

        return;
      }

      const updatedBlockStatus = await updateUserBlock.execute(
        user.id,
        blockStatus
      );

      if (!updatedBlockStatus) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.NOT_FOUND,
          null,
          "Cannot toggle block status of user"
        );

        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        updatedBlockStatus,
        "User block status updated successfully"
      );
    } catch (error) {
      console.log("error while updating the user block status", error);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "error while updating the user block status"
      );
    }
  }

  static async adduser(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const newuserData = req.body.newuserData;
      console.log("user data received", newuserData);

      const existingUser = await findUserByEmail.execute(newuserData.email);

      if (existingUser) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          existingUser,
          "Email already exists"
        );

        return;
      }

      if (newuserData && newuserData.imageUrl) {
        const cloudinaryUrl = await uploadImage({
          image: newuserData.imageUrl,
          folder: "user-management-react-nodejs/user",
        });

        newuserData.imageUrl = cloudinaryUrl;
      }

      const hashedPassword = await hashPassword(newuserData.password);

      const user = await createUser.execute({
        ...newuserData,
        password: hashedPassword,
      });

      const userData = user.toObject();
      if (!userData) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          null,
          "cannot create new user"
        );

        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        userData,
        "new user created successfully"
      );
    } catch (error) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to create new user"
      );
    }
  }
}
