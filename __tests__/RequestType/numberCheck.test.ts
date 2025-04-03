import { Request } from "express";
import { RequestType } from '../../src/RequestType';
import { PropertyType } from '../../src/ReqResType';

class TestRequestType extends RequestType {
    protected properties: { [key: string]: PropertyType; } = {
        num: { type: 'number', description: 'only number' }
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
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", ""));
        }
    });

    it('input null', () => {
        const body = {num: null}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", ""));
        }
    });

    it('input empty string', () => {
        const body = {num: ""}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("001: " + instance.REQUIRED_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", ""));
        }
    });

    it('input string', () => {
        const body = {num: "str"}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("201: " + instance.INVALID_NUMBER_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", "str"));
        }
    });
    
    it('input boolean true', () => {
        const body = {num: true}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("201: " + instance.INVALID_NUMBER_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", "true"));
        }
    });

    it('input boolean false', () => {
        const body = {num: false}
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("201: " + instance.INVALID_NUMBER_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", "false"));
        }
    });

    it('input object', () => {
        const body = {num: {key: 1}};
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("201: " + instance.INVALID_NUMBER_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", "[object Object]"));
        }
    });

    it('input array', () => {
        const body = {num: [5]};
        const instance = new TestRequestType({body: body} as Request);
        try {
            instance.Data.num;
            fail("fali test");
        } catch (error) {
            expect(error).toBeDefined();
            const message = ((error as unknown) as any).message;
            expect(message).toBe("201: " + instance.INVALID_NUMBER_ERROR_MESSAGE.replace("{property}", "num").replace("{value}", "5"));
        }
    });
});

describe('INPUT SUCCESS CHECK', () => {
    it('input number', () => {
        const body = { num: 1 }
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.num).toBe(1);
    });

    it('input string number', () => {
        const body = { num: "100" }
        const instance = new TestRequestType({body: body} as Request);
        expect(instance.Data.num).toBe(100);
    });
});