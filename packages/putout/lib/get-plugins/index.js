'use strict';

const isEnabled = require('./is-enabled');
const loadPlugin = require('./load-plugin');
const parsePluginNames = require('./parse-plugin-names');
const parseRules = require('./parse-rules');

const defaultOptions = () => Object.create(null);
const mergeRules = ([rule, plugin], rules) => {
    for (const currentRule of rules) {
        if (currentRule.rule !== rule)
            continue;
        
        const {
            msg,
            options,
        } = currentRule;
        
        return {
            rule,
            plugin,
            msg,
            options,
        };
    }
    
    return {
        rule,
        plugin,
        msg: '',
        options: defaultOptions(),
    };
};

module.exports = (options = {}) => {
    const {
        pluginNames = [],
        cache = true,
        rules = {},
    } = options;
    
    const cookedRules = parseRules(rules);
    
    const items = parsePluginNames(pluginNames);
    const plugins = loadPlugins({
        items,
        cache,
    });
    
    const result = [];
    
    for (const plugin of plugins) {
        if (!isEnabled(plugin, cookedRules))
            continue;
        
        result.push(mergeRules(plugin, cookedRules));
    }
    
    return result;
};

function splitRule(rule) {
    const name = rule
        .replace('babel/', '')
        .replace('jscodeshift/', '');
    
    if (/^babel/.test(rule))
        return [
            name,
            'babel',
        ];
    
    if (/^jscodeshift/.test(rule))
        return [
            name,
            'jscodeshift',
        ];
    
    return [
        name,
        'putout',
    ];
}

function loadPlugins({items, cache}) {
    const plugins = [];
    
    for (const [rule, itemPlugin] of items) {
        const [name, namespace] = splitRule(rule);
        
        const plugin = itemPlugin || loadPlugin({
            name,
            namespace,
            pluginCache: cache,
        });
        
        const {rules} = plugin;
        
        if (rules) {
            plugins.push(...extendRules(rule, rules));
            continue;
        }
        
        plugins.push([
            rule,
            plugin,
        ]);
    }
    
    return plugins;
}

function extendRules(rule, plugin) {
    const result = [];
    const entries = Object.entries(plugin);
    
    for (const [name, plugin] of entries) {
        result.push([
            `${rule}/${name}`,
            plugin,
        ]);
    }
    
    return result;
}

