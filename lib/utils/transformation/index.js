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
const protobuf = require('protobufjs');
const fs = require('fs');
const Utils = require('../BaseUtils');
const DataUtils = require('../data');
const $data = new DataUtils();
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
        this.decodeFirestoreEvent = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                const docParts = event.document.split('/');
                const collection = docParts[0];
                const docId = docParts[1];
                console.log('fs', fs.readdirSync('.', 'utf8'));
                const root = yield protobuf.load('./lib/proto/data.proto');
                const DocumentEventData = root.lookupType('google.events.cloud.firestore.v1.DocumentEventData');
                const data = DocumentEventData.decode(event.data);
                return {
                    collection,
                    docId,
                    data,
                };
            }
            catch (error) {
                console.error(error);
                throw new Error();
            }
        });
        this.encodeFirestoreEvent = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('fs', fs.readdirSync('.', 'utf8'));
                const root = yield protobuf.load('./lib/proto/data.proto');
                const DocumentEventData = root.lookupType('google.events.cloud.firestore.v1.DocumentEventData');
                const data = DocumentEventData.encode(event.data).finish();
                return Object.assign(Object.assign({}, event), { data });
            }
            catch (error) {
                console.error(error);
                throw new Error();
            }
        });
        this.parseUpdateDiff = (before, after, exclude = []) => {
            try {
                const diff = $data.getChangeDiffs(after, before, exclude);
                if (!Object.keys(diff.after).length && !Object.keys(diff.before).length) {
                    return false;
                }
                return diff;
            }
            catch (error) {
                console.error(error);
                throw new Error();
            }
        };
    }
};
