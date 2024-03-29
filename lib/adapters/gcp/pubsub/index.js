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
const { PubSub } = require('@google-cloud/pubsub');
const GoogleCloudAdapter = require('../GoogleCloudAdapter');
const { ErrorUtils } = require('../../../utils');
const $error = new ErrorUtils();
module.exports = class PubSubAdapter extends GoogleCloudAdapter {
    constructor(props) {
        super();
        this.createTopic = (name) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [exists] = yield this.pubsub.topic(name).exists();
                if (!exists) {
                    yield this.pubsub.createTopic(name);
                }
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.getTopics = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = [];
                const [topics] = yield this.pubsub.getTopics();
                for (let topic of topics) {
                    response.push(topic);
                }
                return response;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.getTopic = (name) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [topic] = yield this.pubsub.topic(name);
                return topic;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.deleteTopic = (name) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [exists] = yield this.pubsub.topic(name).exists();
                if (exists)
                    yield this.pubsub.topic(name).delete();
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.publishMessage = (props) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { topic, message } = props;
                let dataBuffer;
                if (typeof message === 'string') {
                    dataBuffer = Buffer.from(message);
                }
                else {
                    dataBuffer = Buffer.from(JSON.stringify(message));
                }
                const messageId = yield this.pubsub
                    .topic(topic)
                    .publishMessage({ data: dataBuffer });
                return messageId;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
        this.pubsub;
        if (props && typeof props === 'object') {
            this.pubsub = new PubSub(props);
        }
        else if (props && typeof props === 'string') {
            this.pubsub = new PubSub({ projectId: props });
        }
        else {
            this.pubsub = new PubSub();
        }
    }
};
