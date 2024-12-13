import { Request, Response } from "express";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { FindUserByIdUseCase } from "../../application/usecase/find.user.by.id.usecase";
import { UpdateUserUseCase } from "../../application/usecase/update.user.usecase";
import { FindallUsersUseCase } from "../../application/usecase/find.all.users.usecase";
import { DeleteUserUseCase } from "../../application/usecase/delete.user.usecase";
import { IuserAuthInfoRequest } from "../../application/dto/user.dto";
import { SearchuserUseCase } from "../../application/usecase/search.user.usecase";

const adminRepository = new MongoUserRepository();
const getadminProfile = new FindUserByIdUseCase(adminRepository);
const updateadminProfile = new UpdateUserUseCase(adminRepository);
const findallUsers = new FindallUsersUseCase(adminRepository);
const updateuserProfile = new UpdateUserUseCase(adminRepository);
const deleteuser = new DeleteUserUseCase(adminRepository);
const searchuser = new SearchuserUseCase(adminRepository);

export class AdminController {
  static async getadminProfile(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const admin = req.user;

      if (!admin) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.FORBIDDEN,
          null,
          "Access denied. Unauthorized"
        );
        return;
      }

      const adminDetails = await getadminProfile.execute(admin.id);

      if (!adminDetails) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "Admin not found");
        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        adminDetails,
        "successfully found"
      );
    } catch (error) {
      console.log(`Error in retrieving admin details ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Cannot retrieve admin details"
      );
    }
  }

  static async updateadminProfile(req: IuserAuthInfoRequest, res: Response) {
    try {
      const admin = req.user;

      const adminData = req.body;

      if (!admin) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.FORBIDDEN,
          null,
          "Access denied. Unauthorized"
        );
        return;
      }

      const updatedAdmin = await updateadminProfile.execute(
        adminData,
        admin.id
      );

      if (!updatedAdmin) {
        sendResponse(res, HTTP_STATUS_CODES.NOT_FOUND, null, "Admin not found");

        return;
      }

      sendResponse(
        res,
        HTTP_STATUS_CODES.ok,
        updatedAdmin,
        "Admin data updated successfully"
      );
    } catch (error) {
      console.log(`Error in updating admin details ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to update admin details"
      );
    }
  }

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

  static async updateuserDetails(
    req: IuserAuthInfoRequest,
    res: Response
  ): Promise<void> {
    try {
      const user = req.user;
      const updatedUserData = req.body;

      if (!user) {
        sendResponse(
          res,
          HTTP_STATUS_CODES.BAD_REQUEST,
          null,
          "User id required"
        );
        return;
      }

      const updatedUser = await updateuserProfile.execute(
        user,
        updatedUserData
      );

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

      const searchQuery = req.query as { [key: string]: string }

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
}
