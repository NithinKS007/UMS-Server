import { Response, Request, NextFunction } from "express";
import { authenticateAccessToken } from "../../infrastructure/auth/jwt.service";
import { sendResponse } from "../../shared/utils/http.response";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import {
  IuserAuthInfoRequest,
  UserPayLoadDTO,
} from "../../application/dto/user.dto";

const isAuthenticated = (
  req: IuserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    sendResponse(res, HTTP_STATUS_CODES.UNAUTHORIZED, null, "Unauthorized");
    return;
  }

  try {
    const decoded = authenticateAccessToken(token);

    req.user = decoded as UserPayLoadDTO;
    next();
  } catch (error) {
    sendResponse(res, HTTP_STATUS_CODES.FORBIDDEN, null, "Invalid token");
  }
};

export default isAuthenticated;
