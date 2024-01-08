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
const { Storage } = require('@google-cloud/storage');
const GoogleCloudAdapter = require('../GoogleCloudAdapter');
const { ErrorUtils } = require('../../../utils');
const $error = new ErrorUtils();
module.exports = class StorageAdapter extends GoogleCloudAdapter {
    constructor(props) {
        super();
        this.listBuckets = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let [buckets] = yield this.storage.getBuckets();
                return buckets;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.createBucket = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, location = 'us-central1' } = props;
                let [exists] = yield this.storage.bucket(bucketName).exists();
                let bucket;
                if (!exists) {
                    ;
                    [bucket] = yield this.storage.createBucket(bucketName, { location });
                }
                return bucket;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.deleteBucket = (bucketName) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.storage.bucket(bucketName).deleteFiles({ force: true });
                yield this.storage.bucket(bucketName).delete();
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.listFiles = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, options } = props;
                let [files] = yield this.storage.bucket(bucketName).getFiles(options);
                return files;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.saveFile = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, fileName, content } = props;
                let file = this.storage.bucket(bucketName).file(fileName);
                yield file.save(content);
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.deleteFile = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, fileName } = props;
                let file = this.storage.bucket(bucketName).file(fileName);
                yield file.delete();
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.downloadFile = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, fileName, destination } = props;
                let file = this.storage.bucket(bucketName).file(fileName);
                yield file.download({ destination });
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.renameFile = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, fileName, newFileName } = props;
                let file = this.storage.bucket(bucketName).file(fileName);
                yield file.rename(newFileName);
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.moveFile = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, fileName, newBucketName } = props;
                let file = this.storage.bucket(bucketName).file(fileName);
                let destination = this.storage.bucket(newBucketName);
                yield file.move(destination);
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.copyFile = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { bucketName, fileName, newBucketName, newFileName } = props;
                if (!newBucketName && !newFileName) {
                    throw $error.errorHandler('You must provide a new bucket name or a new file name');
                }
                let file = this.storage.bucket(bucketName).file(fileName);
                let destination = this.storage.bucket(bucketName).file(newFileName);
                if (newBucketName) {
                    if (newFileName) {
                        destination = this.storage.bucket(newBucketName).file(newFileName);
                    }
                    else {
                        destination = this.storage.bucket(newBucketName).file(fileName);
                    }
                }
                yield file.copy(destination);
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.storage;
        if (props && typeof props === 'object') {
            const payload = props.projectId ? { projectId: props.projectId } : {};
            this.storage = new Storage(payload);
        }
        else if (props && typeof props === 'string') {
            const payload = { projectId: props };
            this.storage = new Storage(payload);
        }
        else {
            this.storage = new Storage();
        }
    }
};
