import { HttpException } from "@nestjs/common";

import { HttpStatusCode, ErrorCode } from "./types";

class ApiException extends HttpException {
  constructor(
    private readonly code: ErrorCode,
    private readonly errMessage: string,
    private readonly statusCode: HttpStatusCode
  ) {
    super({ errorCode: code, message: errMessage }, statusCode);
  }
}

export default ApiException;
