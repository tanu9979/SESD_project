import { Response } from 'express';

class ApiResponse {
  static success(res: Response, data: unknown = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static created(res: Response, data: unknown, message = 'Created successfully') {
    return res.status(201).json({ success: true, message, data });
  }

  static error(res: Response, message = 'Something went wrong', statusCode = 500, errors: unknown = null) {
    const body: Record<string, unknown> = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(statusCode).json(body);
  }

  static notFound(res: Response, message = 'Not found') {
    return ApiResponse.error(res, message, 404);
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return ApiResponse.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return ApiResponse.error(res, message, 403);
  }

  static badRequest(res: Response, message = 'Bad request', errors: unknown = null) {
    return ApiResponse.error(res, message, 400, errors);
  }
}

export default ApiResponse;
