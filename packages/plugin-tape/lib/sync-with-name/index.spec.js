'use strict';

const test = require('@putout/test')(__dirname, {
    'tape/sync-with-name': require('.'),
});

test('plugin-tape: sync-with-name: report', (t) => {
    t.reportCode(`const a = stub().withName('b')`, `'stub().withName(name)' should synced with variable name`);
    t.end();
});

test('plugin-tape: sync-with-name: transform: not-synced', (t) => {
    t.transformCode(`const a = stub().withName('b')`, `const a = stub().withName('a')`);
    t.end();
});

test('plugin-tape: sync-with-name: transform: synced', (t) => {
    t.noTransformCode(`const a = stub().withName('a')`);
    t.end();
});

