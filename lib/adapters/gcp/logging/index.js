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
const logging = new Logging();
const write_entry = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { severity, log_name, message } = props;
    yield logging.setDetectedResource();
    const log = logging.log(log_name);
    const metadata = {
        resource: { type: 'global' },
        severity,
    };
    const entry = log.entry(metadata, message);
    log.write(entry);
});
module.exports = class LoggingAdapter extends GoogleCloudAdapter {
    constructor() {
        super();
        this.debug = (log_name, message) => {
            write_entry({ severity: 'DEBUG', log_name, message });
        };
        this.info = (log_name, message) => {
            write_entry({ severity: 'INFO', log_name, message });
        };
        this.warn = (log_name, message) => {
            write_entry({ severity: 'WARN', log_name, message });
        };
        this.error = (log_name, message) => {
            write_entry({ severity: 'ERROR', log_name, message });
        };
    }
};
