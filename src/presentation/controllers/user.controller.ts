import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { hashPassword } from "../../shared/utils/hash.password";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { CreateUserUseCase } from "../../application/usecase/create.user.usecase";
import { FindUserByEmailUseCase } from "../../application/usecase/find.user.by.email.usecase";
import { SigninUserUseCase } from "../../application/usecase/signin.user.usecase";

const userRepository = new MongoUserRepository();
const createUser  = new CreateUserUseCase(userRepository);
const findUserByEmail = new FindUserByEmailUseCase(userRepository);
const signinuser = new SigninUserUseCase(userRepository);

export class UserController {
  static async signup(req: Request, res: Response): Promise<void> {
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

      const { password, ...otherDetails } = user;

      sendResponse(
        res,
        HTTP_STATUS_CODES.CREATED,
        otherDetails,
        "User created successfully"
      );
      return;
    } catch (error) {
      console.log(`Error in user signup : ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to create user. Please try again"
      );
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
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

      const { password: _, ...otherDetails } = user;

      sendResponse(res, HTTP_STATUS_CODES.ok, otherDetails, "Login successful");
    } catch (error) {
      console.log(`Error in signin user : ${error}`);

      sendResponse(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        null,
        "Failed to sign in. Please try again"
      );
    }
  }
}
