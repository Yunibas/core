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
const { BigQuery } = require('@google-cloud/bigquery');
const GoogleCloudAdapter = require('../GoogleCloudAdapter');
const bigquery = new BigQuery();
module.exports = class BigQueryAdapter extends GoogleCloudAdapter {
    constructor() {
        super();
    }
    createDataset({ name, location = 'us-central1', }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [dataset] = yield bigquery.dataset(name).create({
                    location,
                });
                return dataset;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    getDataset({ name, location = 'us-central1', }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [dataset] = yield bigquery.dataset(name).get({
                    location,
                });
                return dataset;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    deleteDataset(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield bigquery.dataset(name).delete({ force: true });
                return true;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    loadFromBucket(props) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileRef = props.storage
                    .bucket(props.bucketName)
                    .file(props.fileName);
                const [job] = yield bigquery
                    .dataset(props.dataset)
                    .table(props.table)
                    .load(fileRef, {
                    sourceFormat: (_a = props.sourceFormat) !== null && _a !== void 0 ? _a : 'CSV',
                    skipLeadingRows: (_b = props.skipLeadingRows) !== null && _b !== void 0 ? _b : 0,
                    schema: props.schema,
                    location: (_c = props.location) !== null && _c !== void 0 ? _c : 'us-central1',
                });
                if (job.status.errors && job.status.errors.length > 0) {
                    throw new Error(job.status.errors);
                }
                return true;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    runQuery(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [job] = yield bigquery.createQueryJob({
                    query: props.sql,
                    location: (_a = props.location) !== null && _a !== void 0 ? _a : 'us-central1',
                });
                const [rows] = yield job.getQueryResults();
                return rows;
            }
            catch (error) {
                let message;
                if (error instanceof Error)
                    message = error.message;
                else
                    message = String(error);
                console.error('runQuery', message);
                throw new Error(message);
            }
        });
    }
};
