import { Request } from 'express';
import ReqResType from "./ReqResType";

export default class RequestType extends ReqResType {

    // *****************************************
    // Input Error Message
    // Please make changes to error messages in the subclass
    // エラー文言
    // エラーメッセージの変更はサブクラスで行ってください
    // *****************************************
    public static INVALID_PATH_PARAM_UUID_ERROR_MESSAGE = 'The {property} in the URL must be a UUID. ({value})';
    public static REQUIRED_ERROR_MESSAGE = '{property} is required.';
    public static UNNECESSARY_INPUT_ERROR_MESSAGE = "{property} is unnecessary input. ({value})";
    public static INVALID_OBJECT_ERROR_MESSAGE = '{property} must be of type Object. ({value})';
    public static INVALID_ARRAY_ERROR_MESSAGE = '{property} must be of type Array. ({value})';
    public static INVALID_NUMBER_ERROR_MESSAGE = '{property} must be of type number. ({value})';
    public static INVALID_BOOL_ERROR_MESSAGE = '{property} must be of type bool or a string with true, false, or a number with 0, 1. ({value})';
    public static INVALID_STRING_ERROR_MESSAGE = '{property} must be of type string. ({value})';
    public static INVALID_UUID_ERROR_MESSAGE = '{property} must be a UUID. ({value})';
    public static INVALID_MAIL_ERROR_MESSAGE = '{property} must be an email. ({value})';
    public static INVALID_DATE_ERROR_MESSAGE = '{property} must be a string in "YYYY-MM-DD" format and a valid date. ({value})';
    public static INVALID_TIME_ERROR_MESSAGE = '{property} must be a string in "hh:mi" format and a valid time. ({value})';
    public static INVALID_DATETIME_ERROR_MESSAGE = '{property} must be a string in "YYYY-MM-DD hh:mi:ss" or "YYYY-MM-DDThh:mi:ss" format and a valid date and time. ({value})';

    /**
     * Throws an exception with the given code and message.
     * If you want to perform custom processing, please change it in the subclass.
     * 指定されたコードとメッセージで例外をスローします。
     * 独自処理を行う場合はサブクラスで変更してください。
     * @param {string} code - The error code. エラーコード
     * @param {string} message - The error message. エラーメッセージ
     */
    protected throwException(code: string, message: string): never {
        throw new Error(`${code}: ${message}`);
    }

    /**
     * Generates an error message based on the provided code, keys, and value.
     * 指定されたコード、キー、および値に基づいてエラーメッセージを生成します。
     * @param {string} code - The error code. エラーコード
     * @param {Array<string | number>} keys - The keys indicating the property path. プロパティパスを示すキー
     * @param {any} value - The value that caused the error. エラーを引き起こした値
     * @returns {string} The generated error message. 生成されたエラーメッセージ
     */
    private ErrorMessage(code: "990" | "001" | "002" | "003" | "004" | "101" | "102" | "103" | "104" |
        "201" | "211" | "212" | "213" | "221" | "231" | "241" | "251" | "252" |
        "261" | "271" | "272", keys: Array<string | number>, value: any): string {
        const list = {
            "990": RequestType.INVALID_PATH_PARAM_UUID_ERROR_MESSAGE,
            "001": RequestType.REQUIRED_ERROR_MESSAGE,
            "101": RequestType.REQUIRED_ERROR_MESSAGE,
            "002": RequestType.INVALID_OBJECT_ERROR_MESSAGE,
            "102": RequestType.INVALID_OBJECT_ERROR_MESSAGE,
            "003": RequestType.INVALID_ARRAY_ERROR_MESSAGE,
            "103": RequestType.INVALID_ARRAY_ERROR_MESSAGE,
            "004": RequestType.UNNECESSARY_INPUT_ERROR_MESSAGE,
            "104": RequestType.UNNECESSARY_INPUT_ERROR_MESSAGE,
            "201": RequestType.INVALID_NUMBER_ERROR_MESSAGE,
            "211": RequestType.INVALID_BOOL_ERROR_MESSAGE,
            "212": RequestType.INVALID_BOOL_ERROR_MESSAGE,
            "213": RequestType.INVALID_BOOL_ERROR_MESSAGE,
            "221": RequestType.INVALID_STRING_ERROR_MESSAGE,
            "231": RequestType.INVALID_UUID_ERROR_MESSAGE,
            "241": RequestType.INVALID_MAIL_ERROR_MESSAGE,
            "251": RequestType.INVALID_DATE_ERROR_MESSAGE,
            "252": RequestType.INVALID_DATE_ERROR_MESSAGE,
            "261": RequestType.INVALID_TIME_ERROR_MESSAGE,
            "271": RequestType.INVALID_DATETIME_ERROR_MESSAGE,
            "272": RequestType.INVALID_DATETIME_ERROR_MESSAGE,
        }
        return list[code].replace("{property}", keys.join('.')).replace("{value}", value);
    }

    // **********************************************************************
    // こちらは基底クラスで使用するものです
    // **********************************************************************
    private data?: {[key: string]: any};
    get Data(): {[key: string]: any} {
        if (this.data === undefined) {
            this.createBody();
        }
        return this.data || {};
    }
    get Headers(): {[key: string]: any} { return this.request.headers; }
    private params?: {[key: string]: any};
    get Params():  {[key: string]: any} {
        if (this.params === undefined) {
            for (const [key, value] of Object.entries(this.request.params)) {
                if (key.includes("id") || key.includes("Id")) {
                    if (this.isUUID(value) === false) {
                        this.throwException("990", this.ErrorMessage("990", [key], value));
                    }
                }
            }
        }
        this.params = this.request.params;
        return this.params;
    }


    private request: Request;

    // get IpAddress(): string | null { return this.request.socket.remoteAddress || null; }
    // get UserAgent(): string { return this.request.headers['user-agent'] as string; }
    // get Language(): string { return this.request.headers['accept-language'] as string; }
    // get AcceptHeader(): string { return this.request.headers['accept'] as string; }
    // get Accept(): string { return this.request.headers['accept'] as string; }
    // get Referer(): string { return this.request.headers['referer'] as string; }
    // get Cookies(): { [key: string]: string } { 
    //     const cookieStr = this.request.headers['cookie'] || '';
    //     return cookieStr.split(';').reduce((acc: { [key: string]: string }, cookie) => {
    //             const [key, value] = cookie.split('=').map(part => part.trim());
    //             acc[key] = value;
    //         return acc;
    //     }, {} as { [key: string]: string }); 
    // }

    constructor(req: Request) {
        super();
        this.request = req;
    }

    /**
     * リクエストボディの値をクラスのプロパティにセットします。
     * 
     * 注意: このメソッドはコンストラクタではなく別メソッドとして実装されています。
     * これは、コンストラクタ内で実行すると継承先のクラスのプロパティが
     * まだ初期化されていないため、正しく値をセットできないためです。
     * 
     * @param {Object} body - リクエストボディオブジェクト
     * @throws {InputErrorException} 入力値が不正な場合にスローされます
     */
    createBody() {

        if (this.request.method === 'GET' || this.request.method === 'DELETE') {
            this.data = this.request.query;
        } else {
            this.data = this.request.body;
        }

        if (this.data === undefined) {
            // ここは基本通ることはないと思いますが...
            throw new Error(`リクエストBodyがundefinedです。`);
        }

        for (const key of Object.keys(this.properties)) {

            // NULLチェック
            if (key in this.data === false || this.data[key] === null || this.data[key] === "") {
                if (this.properties[key].type.endsWith('?')) {
                    // nullの値入れる（undefinedはキー指定なし）
                    if (this.data[key] === null || this.data[key] === "") {
                        this.changeBody([key], null);
                    }
                    continue;
                } else {
                    this.throwException("001", this.ErrorMessage("001", [key], ""));
                }
            }

            const value = this.data[key];
            switch (this.properties[key].type) {
                case 'object':
                case 'object?':
                    if (typeof value === 'object') {
                        this.setObject([key], value);
                    } else {
                        this.throwException("002", this.ErrorMessage("002", [key], value));
                    }
                    break;
                case 'array':
                case 'array?':
                    if (Array.isArray(value)) {
                        this.setArray([key], value);
                    } else {
                        if (this.request.method === 'GET' || this.request.method === 'DELETE') {
                            // GET,DELETEメソッドの場合、?array=1&array=2で配列となるが、
                            // ?array=1のみで終わる場合は配列にならないため、直接配列にしている
                            this.data[key] = [this.convertValue(this.properties[key].properties.type, value, [key, 0])];
                        } else {
                            this.throwException("003", this.ErrorMessage("003", [key], value));
                        }
                    }
                    break;
                default:
                    this.convertInput([key], value);
                    break;
            }
        }

        // 不要項目チェック
        for (const [key, value] of Object.entries(this.data)) {
            if (key in this.properties === false) {
                this.throwException("004", this.ErrorMessage("004", [key], value));
            }
        }
    }

    /**
     * 配列型の値を再帰的に処理します。
     * 配列の各要素を検証し、適切な型に変換します。
     * 
     * @param {Array<string | number>} keys - 現在の処理パス（文字列またはインデックス番号の配列）
     * @param {any[]} values - 処理対象の配列
     * @throws {InputErrorException} 配列要素の型が不正な場合にスローされます
     */
    private setArray(keys: Array<string | number>, values: any) {
        const property = this.getProperty(keys);
        for (let i = 0;i < values.length; i++) {

            switch (property.properties.type) {
                case 'object':
                case 'object?':
                    this.setObject([...keys, i], values[i]);
                    break;
                case 'array':
                case 'array?':
                    this.setArray([...keys, i], values[i]);
                    break;
                default:
                    this.convertInput([...keys, i], values[i]);
                    break;
            }
        }
    }

    /**
     * 指定されたキーパスに対応するプロパティ定義を取得します。
     * @param {Array<string | number>} keys - プロパティへのアクセスパス（文字列またはインデックス番号の配列）
     * @returns {BaseType} プロパティ定義オブジェクト
     */
    private getProperty(keys: Array<string | number>) {
        let property: any = this.properties;
        for (let i = 0;i < keys.length;i++) {
            const key = keys[i];
            if (typeof key === 'number') {
                property = property.properties;
                continue;
            }

            if (i === 0) {
                property = property[key];
            } else {
                property = property.properties[key];
            }
        }

        return property;
    }

    /**
     * リクエストボディの値を指定されたパスに設定します。
     * 必要に応じて中間のオブジェクトや配列を自動的に作成します。
     * @param {Array<string | number>} keys - 設定先へのパス（文字列またはインデックス番号の配列）
     * @param {any} value - 設定する値
     */
    private changeBody(keys: Array<string | number>, value: any) {
        let body: any = this.data;
        // 最後のキーを除いて順番にオブジェクトを辿る
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i + 1];
            
            // 次のキーが数値型の場合は配列、そうでない場合はオブジェクトとして初期化
            if (!(key in body)) {
                body[key] = typeof nextKey === 'number' ? [] : {};
            }
            body = body[key];
        }
        // 最後のキーに対して値を設定
        body[keys[keys.length - 1]] = value;
    }

    /**
     * オブジェクト型の値を再帰的に処理します。
     * オブジェクトのプロパティを検証し、適切な型に変換します。
     * @param {Array<string | number>} keys - 現在の処理パス（文字列またはインデックス番号の配列）
     * @param {object} values - 処理対象のオブジェクト
     * @throws {InputErrorException} プロパティの型が不正な場合にスローされます
     */
    private setObject(keys: Array<string | number>, values: {[key: string]: any}) {
        const property = this.getProperty(keys);

        for (const key of Object.keys(property.properties)) {

            // NULLチェック
            if (key in values === false || values[key] === null || values[key] === "") {
                if (property.properties[key].type.endsWith('?')) {
                    // nullの値入れる（undefinedはキー指定なし）
                    if (values[key] === null || values[key] === "") {
                        this.changeBody([...keys, key], null);
                    }
                    continue;
                } else {
                    this.throwException("101", this.ErrorMessage("101", [...keys, key], ""));
                }
            }

            const value = values[key];
            switch (property.properties[key].type) {
                case 'object':
                case 'object?':
                    if (typeof value === 'object') {
                        this.setObject([...keys, key], value);
                    } else {
                        this.throwException("102", this.ErrorMessage("102", [...keys, key], value));
                    }
                    break;
                case 'array':
                case 'array?':
                    if (Array.isArray(value)) {
                        this.setArray([...keys, key], value);
                    } else {
                        this.throwException("103", this.ErrorMessage("103", [...keys, key], value));
                    }
                    break;
                default:
                    this.convertInput([...keys, key], value);
                    break;
            }
        }

        // 不要項目チェック
        for (const [key, value] of Object.entries(values)) {
            if (key in property.properties === false) {
                this.throwException("104", this.ErrorMessage("104", [...keys, key], value));
            }
        }
    }

    /**
     * 指定された型に基づいて入力値を変換します。
     * 型変換に失敗した場合は例外をスローします。
     * 
     * @param {string} type - 変換する型（例: 'number', 'boolean', 'string', 'date', 'time', 'datetime'）
     * @param {any} value - 変換する値
     * @param {Array<string | number>} keys - 処理対象のパス（文字列またはインデックス番号の配列）
     * @returns {any} 変換された値
     * @throws {InputErrorException} 型変換に失敗した場合にスローされます
     */
    private convertValue(type: string, value: any, keys: Array<string | number>) {

        switch (type) {
            case 'number':
            case 'number?':
                if (this.isNumber(value) === false) {
                    this.throwException("201", this.ErrorMessage("201", keys, value));
                }
                return Number(value);
            case 'boolean':
            case 'boolean?':
                switch (typeof value) {
                    case 'boolean':
                        return value;
                    case 'number':
                        if (value !== 0 && value !== 1) {
                            this.throwException("211", this.ErrorMessage("211", keys, value));
                        }
                        return value === 1 ? true : false;
                    case 'string':
                        if (value !== 'true' && value !== 'false') {
                            this.throwException("212", this.ErrorMessage("212", keys, value));
                        }
                        return value === 'true' ? true : false;
                    default:
                        this.throwException("213", this.ErrorMessage("213", keys, value));
                }
            case 'string':
            case 'string?':
                switch (typeof value) {
                    case 'number':
                        return value.toString();
                    case 'string':
                        return value;
                    default:
                        this.throwException("221", this.ErrorMessage("221", keys, value));
                }
            case 'uuid':
            case 'uuid?':
                if (this.isUUID(value)) {
                    return value;
                }
                this.throwException("231", this.ErrorMessage("231", keys, value));
            case 'mail':
            case 'mail?':
                if (this.isMail(value)) {
                    return value;
                }
                this.throwException("241", this.ErrorMessage("241", keys, value));
            case 'date':
            case 'date?':
                if (this.isYYYYMMDD(value) === false) {
                    this.throwException("251", this.ErrorMessage("251", keys, value));
                }

                if (this.isErrorDateTime(value)) {
                    this.throwException("252", this.ErrorMessage("252", keys, value));
                }
                return value;
            case 'time':
            case 'time?':
                if (this.isHHMM(value)) {
                    return `${value}`;
                }
                this.throwException("261", this.ErrorMessage("261", keys, value));
            case 'datetime':
            case 'datetime?':
                if (this.isYYYYMMDDhhmiss(value) === false) {
                    this.throwException("271", this.ErrorMessage("271", keys, value));
                }

                if (this.isErrorDateTime(value)) {
                    this.throwException("272", this.ErrorMessage("272", keys, value));
                }
                return value.replace('T', ' ');
        }

        return value;
    }

    /**
     * 入力値を指定された型に変換します。
     * 型変換に失敗した場合は例外をスローします。
     * @param {Array<string | number>} keys - 処理対象のパス（文字列またはインデックス番号の配列）
     * @param {any} value - 変換する値
     * @throws {InputErrorException} 型変換に失敗した場合にスローされます
     */
    private convertInput(keys: Array<string | number>, value: any) {
        const property = this.getProperty(keys);
        this.changeBody(keys, this.convertValue(property.type, value, keys));
    }

    // /**
    //  * リクエストボディからSwaggerのYAML定義を生成します。
    //  * 
    //  * @returns {string} Swagger形式のYAML定義
    //  */
    // public createSwagger(method: MethodType) {

    //     if (method === 'get' || method === 'delete') {

    //         const tabCount = 4;
    //         const space = '  '.repeat(tabCount);

    //         let ymlString = '';
    //         for (const [key, property] of Object.entries(this.properties)) {
    //             ymlString += `${space}- name: ${key}\n`;
    //             ymlString += `${space}  in: query\n`;
    //             ymlString += `${space}  description: ${property.description}\n`;
    //             ymlString += `${space}  required: ${property.type.endsWith('?') ? 'false' : 'true'}\n`;
    //             ymlString += `${space}  schema:\n`;
    //             ymlString += `${space}    type: ${this.replaceFromPropertyTypeToSwagger(property.type)}\n`;
    //         }

    //         return ymlString;
    //     } else {
    //         const tabCount = 8;
    //         const space = '  '.repeat(tabCount);
    //         let componentYml = '\n';
    //         let requiredList: Array<string> = [];
    //         for (const [key, property] of Object.entries(this.properties)) {
    
    //             if (property.type.endsWith('?') === false) {
    //                 requiredList.push(key);
    //             }
    
    //             componentYml += `${space}${key}:\n`;
    //             componentYml += `  ${space}type: ${this.replaceFromPropertyTypeToSwagger(property.type)}\n`;
    //             componentYml += `  ${space}description: ${property.description}\n`;
    
    //             switch (property.type) {
    //                 case 'object':
    //                 case 'object?':
    //                     componentYml += this.makeSwaggerProperyFromObject([key], tabCount + 1);
    //                     break;
    //                 case 'array':
    //                 case 'array?':
    //                     componentYml += this.makeSwaggerPropertyFromArray([key], tabCount + 1);
    //                     break;
    //             }
    //         }
    
    //         if (requiredList.length > 0) {
    //             componentYml += `              required:\n`;
    //             componentYml += `                - ${requiredList.join(`\n                - `)}\n`;
    //         }
    
    //         let ymlString = `      requestBody:\n`;
    //         ymlString += `        content:\n`;
    //         ymlString += `          application/json:\n`;
    //         ymlString += `            schema:\n`;
    //         ymlString += `              type: object\n`;
    //         ymlString += `              properties:${componentYml}`;
    //         ymlString += `          application/x-www-form-urlencoded:\n`;
    //         ymlString += `            schema:\n`;
    //         ymlString += `              type: object\n`;
    //         ymlString += `              properties:${componentYml}`;

    //         return ymlString;
    //     }
    // }


    // /**
    //  * オブジェクト型のプロパティからSwaggerのプロパティを生成
    //  * @param {Array.<string|number>} keys - プロパティへのパス
    //  * @returns {string} Swagger形式のプロパティ定義
    //  */
    // private makeSwaggerProperyFromObject(keys: Array<string | number>, tabCount: number): string {

    //     const space = '  '.repeat(tabCount);

    //     let ymlString = `${space}properties:\n`;

    //     const properties = this.getProperty(keys).properties;
    //     for (const key of Object.keys(properties)) {
    //         const property = properties[key];

            
    //         ymlString += `${space}  ${key}:\n`;
    //         ymlString += `${space}    type: ${this.replaceFromPropertyTypeToSwagger(property.type)}\n`;
    //         ymlString += `${space}    description: ${property.description}\n`;

    //         switch (property.type) {
    //             case 'object':
    //             case 'object?':
    //                 ymlString += this.makeSwaggerProperyFromObject([...keys, key], tabCount + 2);
    //                 break;
    //             case 'array':
    //             case 'array?':
    //                 ymlString += this.makeSwaggerPropertyFromArray([...keys, key], tabCount + 2);
    //                 break;
    //         }
    //     }

    //     return ymlString;
    // }

    // /**
    //  * 配列型のプロパティからSwaggerのプロパティを生成
    //  * @param {Array.<string|number>} keys - プロパティへのパス
    //  * @returns {string} Swagger形式のプロパティ定義
    //  */
    // private makeSwaggerPropertyFromArray(keys: Array<string | number>, tabCount: number): string {

    //     const property = this.getProperty(keys).properties;

    //     const space = '  '.repeat(tabCount);

    //     let ymlString = `${space}items:\n`;
    //     ymlString += `${space}  type: ${this.replaceFromPropertyTypeToSwagger(property.type)}\n`;
    //     ymlString += `${space}  description: ${property.description}\n`;

    //     switch (property.type) {
    //         case 'object':
    //         case 'object?':
    //             ymlString += this.makeSwaggerProperyFromObject([...keys, 0], tabCount + 1);
    //             break;
    //         case 'array':
    //         case 'array?':
    //             ymlString += this.makeSwaggerPropertyFromArray([...keys, 0], tabCount + 1);
    //             break;
    //     }

    //     return ymlString;
    // }
}