import { Request } from 'express';
import { PropertyType } from './src/ReqResType';
import { IncomingHttpHeaders } from './src/RequestType';

declare module 'test-api-interface-type' {
    export class RequestType {
        constructor(req: Request);

        protected properties: { [key: string]: PropertyType; };

        public readonly INVALID_PATH_PARAM_UUID_ERROR_MESSAGE: string;
        public readonly REQUIRED_ERROR_MESSAGE: string;
        public readonly UNNECESSARY_INPUT_ERROR_MESSAGE: string;
        public readonly INVALID_OBJECT_ERROR_MESSAGE: string;
        public readonly INVALID_ARRAY_ERROR_MESSAGE: string;
        public readonly INVALID_NUMBER_ERROR_MESSAGE: string;
        public readonly INVALID_BOOL_ERROR_MESSAGE: string;
        public readonly INVALID_STRING_ERROR_MESSAGE: string;
        public readonly INVALID_UUID_ERROR_MESSAGE: string;
        public readonly INVALID_MAIL_ERROR_MESSAGE: string;
        public readonly INVALID_DATE_ERROR_MESSAGE: string;
        public readonly INVALID_TIME_ERROR_MESSAGE: string;
        public readonly INVALID_DATETIME_ERROR_MESSAGE: string;
        protected throwException(code: string, message: string): never;

        get Data(): { [key: string]: any };
        get Headers(): IncomingHttpHeaders;
        get Params(): { [key: string]: any };
        get RemoteAddress(): string | undefined;
        get Authorization(): string | null;
        get Req(): Request;
    }

    export class ResponseType {
        protected Data: { [key: string]: any };

        protected properties: { [key: string]: PropertyType; };
        get ResponseData(): { [key: string]: any };
    }
}