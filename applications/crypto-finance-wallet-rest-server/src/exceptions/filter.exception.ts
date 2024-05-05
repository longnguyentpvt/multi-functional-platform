import {
  ExceptionFilter, Catch, ArgumentsHost
} from "@nestjs/common";
import { Response } from "express";

import ApiException from "./api.exception";
import { ErrorCode } from "./types";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let status: number;
    let responseBody: { errorCode: ErrorCode, message: string };
    if (!(exception instanceof ApiException)) {
      status = 500;
      responseBody = {
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Error. Please contact support."
      };
    } else {
      status = exception.getStatus();
      responseBody = exception.getResponse() as { errorCode: ErrorCode, message: string };
    }

    response.status(status).json(responseBody);
  }
}
