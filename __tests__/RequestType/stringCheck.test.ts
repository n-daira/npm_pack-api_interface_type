import { Request } from "express";
import { RequestType } from '../../src/RequestType';
import { PropertyType } from '../../src/ReqResType';

class TestRequestType extends RequestType {
    protected properties: { [key: string]: PropertyType; } = {
        str: { type: 'string', description: 'only string' }
    }
}

describe('INPUT ERROR CHECK', () => {
    it('input empty', () => {
        const body = {}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num; // access and cause an error;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined(); // confirm that occured error
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", ""));
        }
    });

    it('input null', () => {
        const body = {str: null}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", ""));
        }
    });

    it('input empty string', () => {
        const body = {str: ""}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", ""));
        }
    });

    it('input boolean true', () => {
        const body = {str: true}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("221: " + instance.INVALID_STRING_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", "true"));
        }
    });

    it('input boolean false', () => {
        const body = {str: false}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("221: " + instance.INVALID_STRING_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", "false"));
        }
    });

    it('input object', () => {
        const body = {str: {key: "strval"}};
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("221: " + instance.INVALID_STRING_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", "[object Object]"));
        }
    });

    it('input array', () => {
        const body = {str: ["strval"]};
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("221: " + instance.INVALID_STRING_ERROR_MESSAGE.replace("{property}", "str").replace("{value}", "strval"));
        }
    });
});

describe('INPUT SUCCESS CHECK', () => {
    it('input number', () => {
        const body = { str: 1 }
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.str).toBe("1");
    });

    it('input string', () => {
        const body = { str: "strval" }
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.str).toBe("strval");
    });
});