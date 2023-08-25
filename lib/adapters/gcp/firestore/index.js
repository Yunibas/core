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
const { Firestore } = require('@google-cloud/firestore');
const GoogleCloudAdapter = require('../GoogleCloudAdapter');
const firestore = new Firestore();
module.exports = class FirestoreAdapter extends GoogleCloudAdapter {
    constructor() {
        super();
    }
    listCollections(collection, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                if (collection && id) {
                    result = yield firestore
                        .collection(collection)
                        .doc(id)
                        .listCollections();
                }
                else {
                    result = yield firestore.listCollections();
                }
                return result.map((c) => c.id);
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    getDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                const result = yield ref.get();
                if (result.exists) {
                    return Object.assign({ id: props.id }, result.data());
                }
                return false;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    getDocs(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.error('props', JSON.stringify(props));
                let ref = firestore.collection(props.collection);
                if (props.id && props.subcollection) {
                    ref = ref.doc(props.id).collection(props.subcollection);
                }
                if (props.where)
                    ref = ref.where(props.where);
                // Require an orderBy for pagination
                if (props.orderBy)
                    ref = ref.orderBy(props.orderBy);
                // Require a limit for pagination
                let limit = 0;
                if (props.orderBy) {
                    limit = (_a = props.limit) !== null && _a !== void 0 ? _a : 1000;
                    ref = ref.limit(limit !== null && limit !== void 0 ? limit : 1000);
                }
                // Add startAt for pagination when provided
                if (props.startAt) {
                    ref = ref.startAt(props.startAt);
                }
                const snapshot = yield ref.get();
                let docs = [];
                snapshot.forEach((doc) => {
                    docs.push(Object.assign({ id: doc.id }, doc.data()));
                });
                let result = {
                    count: snapshot.docs.length,
                    docs,
                };
                if (limit && snapshot.docs.length === limit) {
                    const last = snapshot.docs[snapshot.docs.length - 1];
                    if (props.orderBy)
                        result.startAt = last.data()[props.orderBy];
                }
                return result;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    getGroupDocs(props) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = firestore.collectionGroup(props.collection);
                if (props.where) {
                    ref = ref.where(props.where);
                }
                // Require an orderBy for pagination
                const orderBy = (_a = props.orderBy) !== null && _a !== void 0 ? _a : 'created_at';
                ref = ref.orderBy(orderBy);
                // Require a limit for pagination
                const limit = (_b = props.limit) !== null && _b !== void 0 ? _b : 1000;
                ref = ref.limit(limit !== null && limit !== void 0 ? limit : 1000);
                // Add startAt for pagination when provided
                if (props.startAt) {
                    ref = ref.startAt(props.startAt);
                }
                const snapshot = yield ref.get();
                const docs = snapshot.docs.map((doc) => {
                    const path = doc.ref.path.split('/');
                    return Object.assign({ id: doc.id, parent_collection: path[0], parent_doc: path[1] }, doc.data());
                });
                let result = {
                    count: docs.length,
                    docs,
                };
                if (docs.length === limit) {
                    const last = docs[docs.length - 1];
                    result.startAt = last.data()[orderBy];
                }
                return result;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    addDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = firestore.collection(props.collection);
                if (props.id && props.subcollection) {
                    ref = ref.doc(props.id).collection(props.subcollection);
                }
                const result = yield ref.add(Object.assign({ created_at: new Date().valueOf() }, props.data));
                if (result.id) {
                    return result.id;
                }
                throw new Error('Add doc failed');
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    replaceDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.set(Object.assign({ updated_at: new Date().valueOf() }, props.data));
                return true;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    updateDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.update(Object.assign({ updated_at: new Date().valueOf() }, props.data));
                return true;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
    deleteDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.delete();
                return true;
            }
            catch (error) {
                // @ts-ignore
                throw new Error(error);
            }
        });
    }
};
