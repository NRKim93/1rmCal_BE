"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsData = void 0;
exports.success = success;
exports.checked = checked;
exports.created = created;
class RsData {
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
}
exports.RsData = RsData;
async function success(data, response) {
    return new RsData(data, "OK");
}
async function checked(code, flg) {
    if (flg)
        return new RsData(code, "OK");
    else
        return new RsData(code, "NG");
}
async function created(dto) {
    return new RsData(dto, "OK");
}
//# sourceMappingURL=RsData.js.map