import ReqResType from "./ReqResType";

export class ResponseType extends ReqResType {

    /**
     * Property to store response data
     * レスポンスデータを格納するためのプロパティ
     */
    protected Data: {[key: string]: any} = {};

    /**
     * Convert and retrieve data according to the type definition
     * 型定義に従ってデータを変換して取得
     * @returns {Object.<string, any>} Converted data, 変換されたデータ
     */
    get ResponseData(): {[key: string]: any} {
        let data: {[key: string]: any} = {};
        for (const [key, property] of Object.entries(this.properties)) {
            if (key in this.Data === false) {
                continue;
            }

            if (this.Data[key] === undefined) {
                continue;
            }

            if (this.Data[key] === null || (property.type.replace("?", "") !== "string" && this.Data[key] === "")) {
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
     * Retrieve object type data
     * オブジェクト型のデータを取得
     * @param {Array.<string|number>} keys - Path to the property, プロパティへのパス
     * @returns {Object.<string, any>} Retrieved object data, 取得されたオブジェクトデータ
     */
    private getObject(keys: Array<string | number>) {

        let resData: {[key: string]: any} = {};
        const data = this.getData(keys);

        const properties = this.getProperty(keys).properties;
        for (const key of Object.keys(properties)) {
            if (key in data === false || data[key] === undefined) {
                continue;
            }

            const property = properties[key];
            if (data[key] === null || (property.type.replace("?", "") !== "string" && data[key] === "")) {
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
     * Retrieve array type data
     * 配列型のデータを取得
     * @param {Array.<string|number>} keys - Path to the property, プロパティへのパス
     * @returns {Array<any> | undefined} Retrieved array data, 取得された配列データ
     */
    private getArray(keys: Array<string | number>) {

        const data = this.getData(keys);
        if (data === undefined || Array.isArray(data) === false) {
            return undefined;
        }

        const properties = this.getProperty(keys).properties;
        let resData: Array<any> = [];
        for (let i = 0;i < data.length; i++) {
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
     * Retrieve property type data
     * プロパティ型のデータを取得
     * @param {Array.<string|number>} keys - Path to the property, プロパティへのパス
     * @returns {any} Retrieved property data, 取得されたプロパティデータ
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
     * Retrieve data based on the provided keys
     * 指定されたキーに基づいてデータを取得
     * @param {Array.<string|number>} keys - Path to the data, データへのパス
     * @returns {any} Retrieved data, 取得されたデータ
     */
    private getData(keys: Array<string | number>) {
        let data: any = this.Data;
        for (let i = 0;i < keys.length;i++) {
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
     * Retrieve value based on the provided keys
     * 指定されたキーに基づいて値を取得
     * @param {Array.<string|number>} keys - Path to the value, 値へのパス
     * @returns {string | number | boolean | null | undefined} Retrieved value, 取得された値
     */
    private getValue(keys: Array<string | number>): string | number | boolean | null | undefined {
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
                    return (value as string).slice(0, 5);
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