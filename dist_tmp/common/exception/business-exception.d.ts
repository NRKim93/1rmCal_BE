import { HttpException, HttpStatus } from '@nestjs/common';
export declare class BusinessException extends HttpException {
    constructor(message: string, status?: HttpStatus);
}
