import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HTTP_STATUS_CODES } from "../../shared/constants/http.status.codes";
import { sendResponse } from "../../shared/utils/http.response";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    sendResponse(
      res,
      HTTP_STATUS_CODES.BAD_REQUEST,
      errors.array(),
      "validation error"
    );
    return
  }

  next()
};
