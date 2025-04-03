"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReqResType_1 = __importDefault(require("./ReqResType"));
class ResponseType extends ReqResType_1.default {
    constructor() {
        super(...arguments);
        // **********************************************************************
        // こちらは基底クラスで使用するものです
        // **********************************************************************
        this.data = {};
        // /**
        //  * Swaggerのレスポンス定義を生成
        //  * @returns {string} Swagger形式のレスポンス定義
        //  */
        // public createSwagger(): string {
        //     let ymlString = `      responses:
        //     '200':
        //       description: 成功事レスポンス
        //       content:
        //         application/json:
        //           schema:
        //             type: object
        //             properties:`;
        //     if (Object.keys(this.properties).length === 0) {
        //         ymlString += ' {}\n'
        //         return ymlString;
        //     }
        //     ymlString += `\n`;
        //     let tabCount = 9;
        //     const space = '  '.repeat(tabCount);
        //     for (const [key, property] of Object.entries(this.properties)) {
        //         ymlString += `${space}${key}:\n`;
        //         ymlString += `${space}  type: ${this.replaceFromPropertyTypeToSwagger(property.type)}\n`;
        //         ymlString += `${space}  description: ${property.description}\n`;
        //         switch (property.type) {
        //             case 'object':
        //             case 'object?':
        //                 ymlString += this.makeSwaggerProperyFromObject([key], tabCount + 1);
        //                 break;
        //             case 'array':
        //             case 'array?':
        //                 ymlString += this.makeSwaggerPropertyFromArray([key], tabCount + 1);
        //                 break;
        //         }
        //     }
        //     return ymlString;
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
    /**
     * 型定義に従ってデータを変換して取得
     * @returns {Object.<string, any>} 変換されたデータ
     */
    get Data() {
        let data = {};
        for (const [key, property] of Object.entries(this.properties)) {
            if (key in this.data === false) {
                continue;
            }
            if (this.data[key] === undefined) {
                continue;
            }
            if (this.data[key] === null) {
                data[key] = property.type.endsWith('?') ? null : undefined;
                continue;
            }
            switch (property.type) {
                case 'object':
                case 'object?':
                    data[key] = this.getObject([key]);
                    break;
                case 'array':
                case 'array?':
                    data[key] = this.getArray([key]);
                    break;
                default:
                    data[key] = this.getValue([key]);
                    break;
            }
        }
        return data;
    }
    /**
     * オブジェクト型のデータを取得
     * @param {Array.<string|number>} keys - プロパティへのパス
     * @returns {Object.<string, any>} 変換されたオブジェクトデータ
     */
    getObject(keys) {
        let resData = {};
        const data = this.getData(keys);
        const properties = this.getProperty(keys).properties;
        for (const key of Object.keys(properties)) {
            if (key in data === false || data[key] === undefined) {
                continue;
            }
            const property = properties[key];
            if (data[key] === null) {
                resData[key] = property.type.endsWith('?') ? null : undefined;
                continue;
            }
            switch (property.type) {
                case 'object':
                case 'object?':
                    resData[key] = this.getObject([...keys, key]);
                    break;
                case 'array':
                case 'array?':
                    resData[key] = this.getArray([...keys, key]);
                    break;
                default:
                    resData[key] = this.getValue([...keys, key]);
                    break;
            }
        }
        return resData;
    }
    /**
     * 配列型のデータを取得
     * @param {Array.<string|number>} keys - プロパティへのパス
     * @returns {Array<any>|undefined} 変換された配列データ
     */
    getArray(keys) {
        const data = this.getData(keys);
        if (data === undefined || Array.isArray(data) === false) {
            return undefined;
        }
        const properties = this.getProperty(keys).properties;
        let resData = [];
        for (let i = 0; i < data.length; i++) {
            switch (properties.type) {
                case 'object':
                case 'object?':
                    resData.push(this.getObject([...keys, i]));
                    break;
                case 'array':
                case 'array?':
                    resData.push(this.getArray([...keys, i]));
                    break;
                default:
                    resData.push(this.getValue([...keys, i]));
                    break;
            }
        }
        return resData;
    }
    /**
     * 指定されたパスのプロパティ定義を取得
     * @param {Array.<string|number>} keys - プロパティへのパス
     * @returns {BaseType} プロパティの型定義
     */
    getProperty(keys) {
        let property = this.properties;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (typeof key === 'number') {
                property = property.properties;
                continue;
            }
            if (i === 0) {
                property = property[key];
            }
            else {
                property = property.properties[key];
            }
        }
        return property;
    }
    /**
     * 指定されたパスのデータを取得
     * @param {Array.<string|number>} keys - プロパティへのパス
     * @returns {any} 取得したデータ
     */
    getData(keys) {
        let data = this.data;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (typeof key === 'number') {
                data = data[key];
                continue;
            }
            data = data[key];
        }
        return data;
    }
    /**
     * プリミティブ値を型定義に従って変換
     * @param {Array.<string|number>} keys - プロパティへのパス
     * @returns {(string|number|boolean|null|undefined)} 変換された値
     */
    getValue(keys) {
        const property = this.getProperty(keys);
        const value = this.getData(keys);
        if (value === null) {
            return property.type.endsWith('?') ? null : undefined;
        }
        switch (property.type) {
            case 'number':
            case 'number?':
                if (this.isNumber(value) === false) {
                    return undefined;
                }
                return Number(value);
            case 'boolean':
            case 'boolean?':
                switch (typeof value) {
                    case 'boolean':
                        return value;
                    case 'number':
                        if (value !== 0 && value !== 1) {
                            return undefined;
                        }
                        return value === 1 ? true : false;
                    case 'string':
                        if (value !== 'true' && value !== 'false') {
                            return undefined;
                        }
                        return value === 'true' ? true : false;
                    default:
                        return undefined;
                }
            case 'string':
            case 'string?':
                switch (typeof value) {
                    case 'number':
                        return value.toString();
                    case 'string':
                        return value;
                    default:
                        return undefined;
                }
            case 'uuid':
            case 'uuid?':
                if (this.isUUID(value)) {
                    return value;
                }
                return undefined;
            case 'mail':
            case 'mail?':
                if (this.isMail(value)) {
                    return value;
                }
                return undefined;
            case 'date':
            case 'date?':
                if (value instanceof Date) {
                    const year = value.getFullYear();
                    const month = String(value.getMonth() + 1).padStart(2, '0');
                    const day = String(value.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
                if (this.isYYYYMMDD(value) && this.isErrorDateTime(value) === false) {
                    return value;
                }
                return undefined;
            case 'time':
            case 'time?':
                if (this.isHHMM(value)) {
                    return `${value}`;
                }
                if (this.isHHMMSS(value)) {
                    return value.slice(0, 5);
                }
                return undefined;
            case 'datetime':
            case 'datetime?':
                if (value instanceof Date) {
                    const year = value.getFullYear();
                    const month = String(value.getMonth() + 1).padStart(2, '0');
                    const day = String(value.getDate()).padStart(2, '0');
                    const hours = String(value.getHours()).padStart(2, '0');
                    const minutes = String(value.getMinutes()).padStart(2, '0');
                    const seconds = String(value.getSeconds()).padStart(2, '0');
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }
                if (this.isYYYYMMDDhhmiss(value) && this.isErrorDateTime(value) === false) {
                    return value.replace('T', ' ');
                }
                return undefined;
            default:
                return undefined;
        }
    }
}
exports.default = ResponseType;
