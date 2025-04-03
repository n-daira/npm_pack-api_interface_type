import { Request } from "express";
import { RequestType } from '../../src/RequestType';
import { PropertyType } from '../../src/ReqResType';

class TestRequestType extends RequestType {
    protected properties: { [key: string]: PropertyType; } = {
        bool: { type: 'boolean', description: 'only boolean' }
    }
}

describe('INPUT ERROR CHECK', () => {
    it('input empty', () => {
        const body = {}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool; // access and cause an error;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined(); // confirm that occured error
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", ""));
        }
    });

    it('input null', () => {
        const body = {bool: null}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", ""));
        }
    });

    it('input empty string', () => {
        const body = {bool: ""}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", ""));
        }
    });

    it('input number 2', () => {
        const body = {bool: 2}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("211: " + instance.INVALID_BOOL_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", "2"));
        }
    });

    it('input number -1', () => {
        const body = {bool: -1}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("211: " + instance.INVALID_BOOL_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", "-1"));
        }
    });

    it('input string', () => {
        const body = {bool: "strval"}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("212: " + instance.INVALID_BOOL_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", "strval"));
        }
    });

    it('input object', () => {
        const body = {bool: {key: "strval"}};
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("213: " + instance.INVALID_BOOL_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", "[object Object]"));
        }
    });

    it('input array', () => {
        const body = {bool: ["strval"]};
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.bool;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("213: " + instance.INVALID_BOOL_ERROR_MESSAGE.replace("{property}", "bool").replace("{value}", "strval"));
        }
    });
});

describe('INPUT SUCCESS CHECK', () => {
    it('input boolean true', () => {
        const body = {bool: true}
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.bool).toBe(true);
    });

    it('input boolean false', () => {
        const body = {bool: false}
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.bool).toBe(false);
    });

    it('input number 1', () => {
        const body = {bool: 1}
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.bool).toBe(true);
    });

    it('input nunmber 0', () => {
        const body = {bool: 0}
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.bool).toBe(false);
    });

    it('input string true', () => {
        const body = {bool: "true"}
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.bool).toBe(true);
    });

    it('input string false', () => {
        const body = {bool: "false"}
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.bool).toBe(false);
    });
});