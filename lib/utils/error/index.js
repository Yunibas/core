"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = require("@bugsnag/js");
const Utils = require('../BaseUtils');
// Custom error class to allow for custom status codes
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
    }
}
class ServiceError extends CustomError {
    constructor(message, props) {
        super(message, props.statusCode || 500);
        this.name = 'ServiceError';
        const $error = new ErrorUtils();
        $error.errorHandler(props);
    }
}
class ControllerError extends CustomError {
    constructor(message, props) {
        super(message, props.statusCode || 500);
        this.name = 'ControllerError';
        const $error = new ErrorUtils();
        $error.errorHandler(props);
    }
}
class ErrorUtils extends Utils {
    constructor(props) {
        super();
        /**
         * @description Error handler
         * @param {object} props
         * @param {object|string|number|boolean|unknown} props.error
         * @param {string} [props.service] - Identifies the source service.
         * @param {string} [props.process] - Identifies the source process.
         * @param {string} [props.action] - Identifies the source action.
         * @param {boolean} [props.log] - Specifies whether to include a console error log.
         * @param {boolean} [props.statusCode] - Sets the HTTP status code for the error or defaults to 500.
         * @param {boolean} [props.bugsnag] - Specifies whether to report error to BugSnag.
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
            if (this.useBugsnag) {
                js_1.default.notify($error);
            }
            return $error;
        };
        this.useBugsnag = false;
        if (props === null || props === void 0 ? void 0 : props.bugsnag) {
            this.useBugsnag = true;
            js_1.default.start(props.bugsnag);
        }
    }
}
module.exports = { ErrorUtils, CustomError, ServiceError, ControllerError };
