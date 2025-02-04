'use strict';

module.exports.report = () => `Avoid useless spread '...'`;

module.exports.replace = () => ({
    'for (const __a of [...__b]) __c': 'for (const __a of __b) __c',
    'Array.from([...__a])': 'Array.from(__a)',
    '[...__a(__args)]': '__a(__args)',
    'new Set([...__a])': 'new Set(__a)',
});

