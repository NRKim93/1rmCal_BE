"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomException = void 0;
const common_1 = require("@nestjs/common");
const error_code_enum_1 = require("./error-code.enum");
class CustomException extends common_1.HttpException {
    constructor(errorCode, cause) {
        const errorInfo = error_code_enum_1.ErrorCode[errorCode];
        super({
            statusCode: errorInfo.status,
            message: errorInfo.message,
            error: errorCode,
        }, errorInfo.status, { cause });
    }
}
exports.CustomException = CustomException;
//# sourceMappingURL=custom-exception.js.map