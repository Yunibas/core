"use strict";
// TODO: Rewrite for use as package
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
module.exports = function useStorage() {
    const listBuckets = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield storage.getBuckets();
            const buckets = result[0];
            return buckets.map((bucket) => bucket.name);
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const createBucket = (bucketName) => __awaiter(this, void 0, void 0, function* () {
        try {
            const [bucket] = yield storage.createBucket(bucketName, {
                location: 'us-central1',
            });
            return bucket;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const deleteBucket = (bucketName) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield storage.bucket(bucketName).delete();
            return true;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const listFiles = ({ bucketName, options }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const [files] = yield storage.bucket(bucketName).getFiles(options);
            return files;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const saveFile = ({ bucketName, destFileName, contents }) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield storage.bucket(bucketName).file(destFileName).save(contents);
            return true;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const deleteFile = ({ bucketName, fileName }) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield storage.bucket(bucketName).file(fileName).delete();
            return true;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const openFile = ({ bucketName, fileName }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const contents = yield storage
                .bucket(bucketName)
                .file(fileName)
                .download();
            return contents;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const renameFile = ({ bucketName, srcFileName, destFileName }) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield storage.bucket(bucketName).file(srcFileName).rename(destFileName);
            return true;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    const copyFile = ({ srcBucketName, srcFileName, destBucketName, destFileName, }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const srcBucket = storage.bucket(srcBucketName);
            const srcFile = srcBucket.file(srcFileName);
            const destBucket = storage.bucket(destBucketName);
            const destFile = destBucket.file(destFileName);
            yield srcFile.copy(destFile);
            return true;
        }
        catch (error) {
            throw new Error(error);
        }
    });
    return {
        listBuckets,
        createBucket,
        deleteBucket,
        listFiles,
        saveFile,
        deleteFile,
        openFile,
        renameFile,
        copyFile,
    };
};
