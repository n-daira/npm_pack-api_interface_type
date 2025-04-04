import { Request } from "express";
import { RequestType } from '../../src/RequestType';
import { PropertyType } from '../../src/ReqResType';
import TestUtils from "../TestUtils";

class TestRequestType extends RequestType {
    protected properties: { [key: string]: PropertyType; } = {
        arr: { 
            type: 'array?',
            properties: {type: "string?"}
        }
    }
}

// ********************************************************
// * error test
// ********************************************************
const errorCheck = (param: {[key: string]: any}, errorCode: string, errorMessage: string, errorValue: string, errorIndex: number | null = null) => {
    for (const method of TestUtils.METHODS) {
        if (['GET', 'DELETE'].includes(method)) {
            // ここもテストしたいがどのようにするか...(別メソッドで分ける)
            continue;
        }

        it (`${method} method`, () => {
            const instance = new TestRequestType(TestUtils.createMockRequest(method, param));
            try {
                instance.Data.arr; // access and cause an error;
                fail("fali test");
            } catch (error) {
                expect(error).toBeDefined(); // confirm that occured error
                const message = ((error as unknown) as any).message;
                expect(message).toBe(`${errorCode}: ${errorMessage.replace("{property}", `arr${errorIndex === null ? '' : `.${errorIndex}`}`).replace("{value}", errorValue)}`);
            }
        });
    }
}

// instance for error message
const r = new TestRequestType({} as Request);

// describe('input error check unnecessary input', () => {
//     const param = {arr: [], aaa: true}
//     for (const method of TestUtils.METHODS) {
//         it (`${method} method`, () => {
//             const instance = new TestRequestType(TestUtils.createMockRequest(method, param));
//             try {
//                 instance.Data.arr; // access and cause an error;
//                 fail("fali test");
//             } catch (error) {
//                 expect(error).toBeDefined(); // confirm that occured error
//                 const message = ((error as unknown) as any).message;
//                 expect(message).toBe(`004: ${instance.UNNECESSARY_INPUT_ERROR_MESSAGE.replace("{property}", "aaa")}`);
//             }
//         })
//     }
// })

// describe('input error check fail input', () => {
//     describe('input number 2', () => {
//         errorCheck({arr: 2}, "003", r.INVALID_ARRAY_ERROR_MESSAGE, "2");
//     });

//     describe('input string', () => {
//         errorCheck({arr: "strval"}, "003", r.INVALID_ARRAY_ERROR_MESSAGE, "strval");
//     });

//     describe('input boolean true', () => {
//         errorCheck({arr: true}, "003", r.INVALID_ARRAY_ERROR_MESSAGE, "true");
//     });

//     describe('input boolean false', () => {
//         errorCheck({arr: false}, "003", r.INVALID_ARRAY_ERROR_MESSAGE, "false");
//     });

//     describe('input object', () => {
//         errorCheck({arr: {key: "strval"}}, "003", r.INVALID_ARRAY_ERROR_MESSAGE, "[object Object]");
//     });

//     describe('input array object', () => {
//         errorCheck({arr: [{key: "strval"}]}, "221", r.INVALID_STRING_ERROR_MESSAGE, "[object Object]", 0);
//     });

//     describe('input array bool 2nd', () => {
//         errorCheck({arr: ["strval", true]}, "221", r.INVALID_STRING_ERROR_MESSAGE, "true", 1);
//     });
// });

// ********************************************************
// * success test
// ********************************************************
const successCheck = (param: {[key: string]: any}, toBe: Array<any> | null, isFormatOneIndex: boolean = true) => {
    for (const method of TestUtils.METHODS) {
        it (`${method} method`, () => {
            if (isFormatOneIndex && ['GET', 'DELETE'].includes(method) && param.arr.length === 1) {
                param = {arr: param.arr[0]};
            }
            const instance = new TestRequestType(TestUtils.createMockRequest(method, param));
            if (toBe === null) {
                expect(instance.Data.arr).toBe(toBe);
            } else {
                expect(instance.Data.arr.length).toBe(toBe.length);
                for (let i = 0;i < instance.Data.arr.length;i++) {
                    expect(instance.Data.arr[i]).toBe(toBe[i]);
                }
            }
        })
    }
}

const successCheckEmpty = (param: {[key: string]: any}, toBe: any) => {
    for (const method of TestUtils.METHODS) {
        it (`${method} method`, () => {
            const instance = new TestRequestType(TestUtils.createMockRequest(method, param));
            expect(instance.Data.arr).toBe(toBe);
        })
    }
}

describe('input success check null', () => {
    describe('input empty', () => {
        successCheckEmpty({}, null);
    });

    describe('input null', () => {
        successCheckEmpty({arr: null}, null);
    });

    describe('input empty string', () => {
        successCheckEmpty({arr: ""}, null);
    });
})


describe('input success check', () => {
    describe('input array 1index empty array', () => {
        successCheck({arr: []}, []);
    })

    describe('input array 1index null', () => {
        successCheck({arr: [null]}, [null], false);
    })

    describe('input array 1index string empty', () => {
        successCheck({arr: [""]}, [""], false);
    })

    describe('input array index string', () => {
        successCheck({arr: ["strval"]}, ["strval"]);
    })

    describe('input array 1index number', () => {
        successCheck({arr: [999]}, ["999"]);
    })

    describe('input array 7index', () => {
        successCheck({arr: ["strval", 300, "strval3", "true", null, "", undefined]}, ["strval", "300", "strval3", "true", null, "", undefined]);
    })
})