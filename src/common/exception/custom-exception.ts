import { HttpException } from '@nestjs/common';
import { ErrorCode, ErrorCodeType } from './error-code.enum';

export class CustomException extends HttpException {
  constructor(errorCode: ErrorCodeType, cause?: Error) {
    const errorInfo = ErrorCode[errorCode];
    super(
      {
        statusCode: errorInfo.status,
        message: errorInfo.message,
        error: errorCode,
      },
      errorInfo.status,
      { cause },
    );
  }
} 