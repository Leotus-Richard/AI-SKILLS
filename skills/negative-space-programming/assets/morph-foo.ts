import { strict as assert } from "node:assert";

type Foo = {
    bar?: number;
};

function morphFoo(foo: Foo): number {
    assert(foo.bar !== undefined, "foo.bar must be defined before morphFoo");
    return foo.bar * 5;
}

export { morphFoo, type Foo };
