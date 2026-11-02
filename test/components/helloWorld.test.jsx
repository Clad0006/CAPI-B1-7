import {expect,test} from "vitest";
import HelloWorld from "../../src/components/HelloWorld/helloWorld.jsx"
import React from "react";

test('HelloWorld component', () => {
    expect(HelloWorld()).toStrictEqual(
        <div>
            <h1>Hello World !</h1>
        </div>);
})