"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform = require('lodash/transform');
const isEqual = require('lodash/isEqual');
const isObject = require('lodash/isObject');
const isArray = require('lodash/isArray');
const Utils = require('../BaseUtils');
module.exports = class DataUtils extends Utils {
    constructor() {
        super();
        this.objectDiffs = (newObj, oldObj) => {
            const result = transform(newObj, (result, value, key) => {
                if (!isEqual(value, oldObj[key])) {
                    result[key] =
                        isObject(value) && !isArray(value) && isObject(oldObj[key])
                            ? this.objectDiffs(value, oldObj[key])
                            : value;
                }
            });
            if (!result || JSON.stringify(result) === '{}')
                return null;
            return result;
        };
        this.getChangeDiffs = (newObj, oldObj, exclude = []) => {
            exclude.forEach((field) => {
                delete newObj[field];
                delete oldObj[field];
            });
            const before = this.objectDiffs(oldObj, newObj);
            const after = this.objectDiffs(newObj, oldObj);
            return { before, after };
        };
    }
};
