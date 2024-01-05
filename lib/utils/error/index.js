"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require('../BaseUtils');
module.exports = class ErrorUtils extends Utils {
    constructor() {
        super();
        /**
         * @description Error handler
         * @param {object|string|number|boolean|unknown} error
         * @param {string} [service] - Identifies the source service.
         * @param {string} [process] - Identifies the source process.
         * @param {string} [action] - Identifies the source action.
         * @param {boolean} [log] - Specifies whether to include a console error log.
         * @returns {Error}
         */
        this.errorHandler = (props) => {
            const { error, service, process, action, log } = props;
            // Handle error value
            let $error = error;
            if (!(error instanceof Error)) {
                let stringified = '[Unable to display the error value]';
                if (typeof error === 'string') {
                    stringified = error;
                }
                if (typeof error === 'number' ||
                    typeof error === 'boolean' ||
                    typeof error === 'object') {
                    stringified = JSON.stringify(error);
                }
                $error = new Error(String(stringified));
            }
            if (log) {
                let message = $error.message;
                if (action) {
                    message = `[${action}] ${message}`;
                }
                if (process) {
                    message = `[${process}] ${message}`;
                }
                if (service) {
                    message = `[${service}] ${message}`;
                }
                console.error(message);
            }
            return $error;
        };
    }
};
