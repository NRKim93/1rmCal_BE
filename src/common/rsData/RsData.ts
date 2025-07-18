import {HttpStatusCode} from "axios";
import {ErrorCode, ErrorCodeType, ErrorResponse} from "../exception/error-code.enum";

export class RsData {
    constructor(
        public statusCode: number,
        public message: string,
        public data? : any
    ) {}
}

//  HTTP_STATUS_CODE : 200일 경우
export async function success(code : HttpStatusCode) : Promise<RsData> {
    return new RsData(code, "OK");
}

//  NG일 경우
export async function failure(error: ErrorCodeType) : Promise<RsData> {
    const err = ErrorCode[error];

    return new RsData(err.status, err.message);
}