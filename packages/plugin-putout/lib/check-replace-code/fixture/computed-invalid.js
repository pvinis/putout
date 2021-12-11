const BODIES = {
    string: `typeof __a === 'string'`,
    number: `typeof __a === 'number'`,
    boolean: `typeof __a === 'boolean'`,
    undefined: `typeof __a === 'undefined'`,
    symbol: `typeof __a === 'symbol'`,
};

const {NOT_OBJECT_EXPRESSION} = options;

module.exports.replace = () => ({
    [NOT_FOUND.function]: 'isFn(__a)',
    [BODIES.string]: 'isString(__a)',
    [NOT_MEMBER_EXPRESSION]: 'isNumber(__a)',
    [NOT_OBJECT_EXPRESSION.boolean]: 'isBool(__a)',
    [BODIES.undefined]: 'isUndefined(__a)',
    [BODIES.symbol]: 'isSymbol(__a)',
});
