"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieUtil = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class CookieUtil {
    static setCookie(res, name, value, maxAge, domain) {
        const option = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge,
            path: '/',
        };
        if (domain)
            option.domain = domain;
        res.cookie(name, value, option);
    }
    static clearCookie(res, name, domain) {
        const option = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        };
        if (domain)
            option.domain = domain;
        res.cookie(name, '', option);
    }
    static useCookieParser(app) {
        app.use((0, cookie_parser_1.default)());
    }
}
exports.CookieUtil = CookieUtil;
//# sourceMappingURL=cookie.util.js.map