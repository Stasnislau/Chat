import { HttpException } from "@nestjs/common";

class ApiError extends HttpException {
  constructor(status: number, message: string) {
    super(message, status);
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }
  static unauthorized(message: string) {
    return new ApiError(401, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }
  static notFound(message: string) {
    return new ApiError(404, message);
  }
  static internal(message: string) {
    return new ApiError(500, message);
  }
  static notImplemented(message: string) {
    return new ApiError(501, message);
  }
  static badGateway(message: string) {
    return new ApiError(502, message);
  }
  static serverUnavailable(message: string) {
    return new ApiError(503, message);
  }
}

export default ApiError;