"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReqResType {
    constructor() {
        this.properties = {};
    }
    /**
     * Checks if the value is a valid date-time format
     * 値が有効な日付時間形式かどうかを確認します
     * @param value - 検証する値, The value to be validated
     * @returns {boolean} - 値が有効な日付時間形式であるかどうか, Whether the value is a valid date-time format
     */
    isErrorDateTime(value) {
        try {
            const [datePart, timePart] = value.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            let [hour, minute, sec] = [0, 0, 0];
            if (timePart !== undefined) {
                [hour, minute, sec] = timePart.split(':').map(Number);
            }
            const date = new Date(year, month - 1, day, hour, minute, sec);
            return year !== date.getFullYear() ||
                month !== date.getMonth() + 1 ||
                day !== date.getDate() ||
                hour !== date.getHours() ||
                minute !== date.getMinutes() ||
                sec !== date.getSeconds();
        }
        catch (error) {
            return true;
        }
    }
    /**
     * Validates if the given value is in the format YYYY-MM-DD
     * 与えられた値がYYYY-MM-DD形式であるかどうかを検証します
     * @param value - The value to be validated, 検証する値
     * @returns {boolean} - Whether the value is in the format YYYY-MM-DD, 値がYYYY-MM-DD形式であるかどうか
     */
    isYYYYMMDD(value) {
        if (typeof value !== 'string') {
            return false;
        }
        const pattern = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');
        return pattern.test(value);
    }
    /**
     * Validates if the given value is in the format YYYY-MM-DD hh:mm:ss
     * 与えられた値がYYYY-MM-DD hh:mm:ss形式であるかどうかを検証します
     * @param value - The value to be validated, 検証する値
     * @returns {boolean} - Whether the value is in the format YYYY-MM-DD hh:mm:ss, 値がYYYY-MM-DD hh:mm:ss形式であるかどうか
     */
    isYYYYMMDDhhmiss(value) {
        if (typeof value !== 'string') {
            return false;
        }
        const pattern = new RegExp('^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}$');
        return pattern.test(value);
    }
    /**
     * Validates if the given value is in the format YYYY-MM-DD hh:mm:ss
     * 与えられた値がYYYY-MM-DD hh:mm:ss形式であるかどうかを検証します
     * @param value - The value to be validated, 検証する値
     * @returns {boolean} - Whether the value is in the format YYYY-MM-DD hh:mm:ss, 値がYYYY-MM-DD hh:mm:ss形式であるかどうか
     */
    isHHMM(value) {
        if (typeof value !== 'string') {
            return false;
        }
        const pattern = new RegExp('^(?:[01]\\d|2[0-3]):[0-5]\\d$');
        return pattern.test(value);
    }
    /**
     * Validates if the given value is in the format HH:MM:SS
     * 与えられた値がHH:MM:SS形式であるかどうかを検証します
     * @param value - The value to be validated, 検証する値
     * @returns {boolean} - Whether the value is in the format HH:MM:SS, 値がHH:MM:SS形式であるかどうか
     */
    isHHMMSS(value) {
        if (typeof value !== 'string') {
            return false;
        }
        const pattern = new RegExp('^(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$');
        return pattern.test(value);
    }
    /**
     * Validates if the given value is a number
     * 与えられた値が数値であるかどうかを検証します
     * @param value - The value to be validated, 検証する値
     * @returns {boolean} - Whether the value is a number, 値が数値であるかどうか
     */
    isNumber(value) {
        switch (typeof value) {
            case 'string':
                if (value == "") {
                    return false;
                }
                return isNaN(Number(value)) == false;
            case 'number':
                return true;
            default:
                return false;
        }
    }
    /**
     * Validates if the given value is a valid UUID
     * 与えられた値が有効なUUIDであるかどうかを検証します
     * @param value - The value to be validated, 検証する値
     * @returns {boolean} - Whether the value is a valid UUID, 値が有効なUUIDであるかどうか
     */
    isUUID(value) {
        if (typeof value !== 'string') {
            return false;
        }
        const pattern = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        return pattern.test(value);
    }
    /**
     * 値がメールアドレス形式であるかどうかを検証します
     * Validates if the given value is in the format of an email address
     * @param value - 検証する値, The value to be validated
     * @returns {boolean} - 値がメールアドレス形式であるかどうか, Whether the value is in the format of an email address
     */
    isMail(value) {
        if (typeof value !== 'string') {
            return false;
        }
        const pattern = new RegExp('^[a-zA-Z0-9_%+-]+([.][a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9]+([-.]?[a-zA-Z0-9]+)*\\.[a-zA-Z]{2,}$');
        return pattern.test(value);
    }
    /**
     * プロパティの型をSwagger形式に変換します
     * Converts the property type to Swagger format
     * @param {string} value - 変換する値, The value to be converted
     * @returns {string} - Swagger形式の値, The value in Swagger format
     */
    replaceFromPropertyTypeToSwagger(value) {
        value = value.replace('?', '');
        value = value.replace('number', 'integer');
        value = value.replace(/datetime|date|time|uuid|mail/g, 'string');
        return value;
    }
}
exports.default = ReqResType;
