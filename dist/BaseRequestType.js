"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRequestType = void 0;
// src/BaseRequestType.ts
class BaseRequestType {
    constructor(url, method) {
        this.url = url;
        this.method = method;
    }
    getRequestInfo() {
        return `Request to ${this.url} with method ${this.method}`;
    }
}
exports.BaseRequestType = BaseRequestType;
