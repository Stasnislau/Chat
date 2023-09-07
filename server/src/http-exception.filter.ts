import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";

import ApiError from "./exceptions/api-error";
@Catch(ApiError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ApiError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || "Internal Server Error";
    const name = "Server Error";
    return response.status(status).json({
      statusCode: status,
      message,
      name,
    });
  }
}

export default HttpExceptionFilter;
