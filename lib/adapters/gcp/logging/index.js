"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Logging } = require('@google-cloud/logging');
const GoogleCloudAdapter = require('../GoogleCloudAdapter');
const { ErrorUtils } = require('../../../utils');
const $errorUtils = new ErrorUtils();
const write_entry = (props) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { severity, log_name, labels, message } = props;
        const $logging = new Logging();
        yield $logging.setDetectedResource();
        // Selects the log to write to
        const log = $logging.log(log_name);
        // The metadata associated with the entry
        const metadata = {
            resource: {
                type: 'global',
            },
            labels: labels || {},
            severity,
        };
        // Prepares a log entry
        const entry = log.entry(metadata, message);
        // switch (severity) {
        //   case 'DEBUG':
        //     console.log(entry)
        //     log.debug(entry)
        //   case 'INFO':
        //     log.info(entry)
        //   case 'WARN':
        //     log.warning(entry)
        //   case 'ERROR':
        //     log.error(entry)
        //   default:
        //     log.notice(entry)
        // }
        log.write(entry); // Writes the log entry
        return void 0;
    }
    catch (err) {
        throw $errorUtils.errorHandler(err);
    }
});
module.exports = class LoggingAdapter extends GoogleCloudAdapter {
    constructor() {
        super();
        this.debug = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield write_entry(Object.assign({ severity: 'DEBUG' }, props));
                return true;
            }
            catch (error) {
                throw $errorUtils.errorHandler(error);
            }
        });
        this.info = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield write_entry(Object.assign({ severity: 'INFO' }, props));
                return true;
            }
            catch (error) {
                throw $errorUtils.errorHandler(error);
            }
        });
        this.warn = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield write_entry(Object.assign({ severity: 'WARNING' }, props));
                return true;
            }
            catch (error) {
                throw $errorUtils.errorHandler(error);
            }
        });
        this.error = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield write_entry(Object.assign({ severity: 'ERROR' }, props));
                return true;
            }
            catch (error) {
                throw $errorUtils.errorHandler(error);
            }
        });
    }
};
