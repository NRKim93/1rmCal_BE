import { HttpStatus } from '@nestjs/common';
export declare class ErrorResponse {
    readonly status: HttpStatus;
    readonly message: string;
    constructor(status: HttpStatus, message: string);
}
export declare const ErrorCode: {
    readonly UNREADABLE_REQUEST_PAYLOAD: ErrorResponse;
    readonly JSON_PROCESSING_EXCEPTION: ErrorResponse;
    readonly UNAUTHORIZED: ErrorResponse;
    readonly INVALID_OAUTH_CODE: ErrorResponse;
    readonly ACCESS_DENIED: ErrorResponse;
    readonly MISSING_ACCESS_TOKEN: ErrorResponse;
    readonly MISSING_REFRESH_TOKEN: ErrorResponse;
    readonly NOT_ACCESS_TOKEN: ErrorResponse;
    readonly NOT_REFRESH_TOKEN: ErrorResponse;
    readonly USER_NOT_FOUND: ErrorResponse;
    readonly USER_ALREADY_EXISTS: ErrorResponse;
    readonly NOW_USING_NICKNAME: ErrorResponse;
    readonly INVALID_USER_DATA: ErrorResponse;
    readonly WORKOUT_NOT_FOUND: ErrorResponse;
    readonly WORKOUT_ACCESS_DENIED: ErrorResponse;
    readonly INVALID_WORKOUT_DATA: ErrorResponse;
    readonly EXERCISE_NOT_FOUND: ErrorResponse;
    readonly EXERCISE_ALREADY_EXISTS: ErrorResponse;
    readonly INVALID_EXERCISE_DATA: ErrorResponse;
    readonly INVALID_1RM_CALCULATION: ErrorResponse;
    readonly INVALID_WEIGHT_DATA: ErrorResponse;
    readonly INVALID_REPS_DATA: ErrorResponse;
    readonly DATABASE_ERROR: ErrorResponse;
    readonly TRANSACTION_FAILED: ErrorResponse;
    readonly EXTERNAL_SERVICE_ERROR: ErrorResponse;
    readonly API_CALL_FAILED: ErrorResponse;
    readonly JWT_PRIVATE_KEY_FAILED: ErrorResponse;
    readonly JWT_PUBLIC_KEY_FAILED: ErrorResponse;
    readonly DB_ERROR: ErrorResponse;
};
export type ErrorCodeType = keyof typeof ErrorCode;
