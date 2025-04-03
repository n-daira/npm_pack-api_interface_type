// src/BaseRequestType.ts
export class BaseRequestType {
    constructor(public url: string, public method: string) {}

    getRequestInfo(): string {
        return `Request to ${this.url} with method ${this.method}`;
    }
}