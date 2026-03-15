import { HttpException } from '@nestjs/common';
import { ErrorCodeType } from './error-code.enum';
export declare class CustomException extends HttpException {
    constructor(errorCode: ErrorCodeType, cause?: Error);
}
