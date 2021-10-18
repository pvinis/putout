'use strict';

const test = require('supertape');
const putout = require('putout');
const montag = require('montag');

const {addArgument} = require('./add-argument.js');

test('putout: operator: add-argument', (t) => {
    const declarations = {
        compare: ['{compare}', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        test('', () => {
            compare(a, b);
        });
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    const expected = montag`
        test('', (
            {
                compare
            }
        ) => {
            compare(a, b);
        });
    `;
    
    t.equal(code, expected);
    t.end();
});

test('putout: operator: add-argument: when argument already exist', (t) => {
    const declarations = {
        compare: ['{compare}', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        test('', ({compare, comparePlaces}) => {
            compare(a, b);
            comparePlaces(a, b);
        });
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    const expected = montag`
        test('', ({compare, comparePlaces}) => {
            compare(a, b);
            comparePlaces(a, b);
        });
    `;
    
    t.equal(code, expected);
    t.end();
});

test('putout: operator: add-argument: rename', (t) => {
    const declarations = {
        superCompare: ['{compare: superCompare}', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        test('', ({}) => {
            superCompare(a, b);
        });
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    const expected = montag`
        test('', ({
            compare: superCompare
        }) => {
            superCompare(a, b);
        });
    `;
    
    t.equal(code, expected);
    t.end();
});

test('putout: operator: add-argument: identifier', (t) => {
    const declarations = {
        t: ['t', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        test('', () => {
            t.end();
        });
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    const expected = montag`
        test('', t => {
            t.end();
        });
    `;
    
    t.equal(code, expected);
    t.end();
});

test('putout: operator: add-argument: options', (t) => {
    const args = {
    };
    
    const source = montag`
        test('', () => {
            t.end();
        });
    `;
    
    const {code} = putout(source, {
        rules: {
            'add-argument': ['on', {
                args: {
                    t: ['t', 'test("__a", (__args) => __body)'],
                },
            }],
        },
        plugins: [
            ['add-argument', addArgument(args)],
        ],
    });
    
    const expected = montag`
        test('', t => {
            t.end();
        });
    `;
    
    t.equal(code, expected);
    t.end();
});

test('putout: operator: add-argument: has binding', (t) => {
    const declarations = {
        t: ['t', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        test('', (t) => {
            t.end();
        });
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    t.equal(code, source);
    t.end();
});

test('putout: operator: add-argument: wrong place', (t) => {
    const declarations = {
        t: ['t', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        const a = () => {
            t();
        };
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    t.equal(code, source);
    t.end();
});

test('putout: operator: add-argument: not a function', (t) => {
    const declarations = {
        t: ['t', 'test("__a", (__args) => __body)'],
    };
    
    const source = montag`
        t();
    `;
    
    const {code} = putout(source, {
        plugins: [
            ['addArgument-undefined-variables', addArgument(declarations)],
        ],
    });
    
    t.equal(code, source);
    t.end();
});