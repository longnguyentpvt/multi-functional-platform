import { HttpException } from "@nestjs/common";

import { HttpStatusCode, ErrorCode } from "./types";

class ApiException extends HttpException {
  constructor(
    code: ErrorCode,
    errMessage: string,
    statusCode: HttpStatusCode
  ) {
    super({ errorCode: code, message: errMessage }, statusCode);
  }
}

export default ApiException;
