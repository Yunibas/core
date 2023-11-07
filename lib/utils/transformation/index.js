"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require('../BaseUtils');
module.exports = class TransformUtils extends Utils {
    constructor() {
        super();
        this.parsePubSubMessage = (message) => {
            const raw_message = message.data.message.data;
            if (!raw_message)
                throw new Error('Missing message');
            const str_message = Buffer.from(raw_message, 'base64').toString();
            if (!JSON.parse(str_message))
                throw new Error('Malformed message');
            const event = JSON.parse(str_message);
            return event;
        };
    }
};
