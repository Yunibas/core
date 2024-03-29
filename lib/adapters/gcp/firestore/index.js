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
const { Firestore, FieldValue, Filter } = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const GoogleCloudAdapter = require('../GoogleCloudAdapter');
const { ErrorUtils } = require('../../../utils');
const $error = new ErrorUtils();
module.exports = class FirestoreAdapter extends GoogleCloudAdapter {
    constructor(props) {
        super();
        this.firestore;
        if (props && typeof props === 'object') {
            this.firestore = new Firestore(props);
        }
        else if (props && typeof props === 'string') {
            this.firestore = new Firestore({ projectId: props });
        }
        else {
            this.firestore = new Firestore();
        }
    }
    /**
     * List collections
     * @param {string} collection
     * @param {string} id
     * @returns {Promise<string[]>}
     * @memberof FirestoreAdapter
     * @example
     * const collections = await firestore.listCollections()
     * const collections = await firestore.listCollections('users', '1234567890')
     */
    listCollections(collection, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                if (collection && id) {
                    result = yield this.firestore
                        .collection(collection)
                        .doc(id)
                        .listCollections();
                }
                else {
                    result = yield this.firestore.listCollections();
                }
                return result.map((c) => c.id);
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    /**
     * Get document by id
     * @param {object} props
     * @param {string} props.collection
     * @param {string} props.id
     * @param {string} props.subcollection
     * @param {string} props.subid
     * @returns {Promise<string[]>}
     * @memberof FirestoreAdapter
     * @example
     * const documents = await firestore.getDoc('users', '1234567890')
     * const documents = await firestore.getDoc('users', '1234567890', 'posts', '0987654321')
     */
    getDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection).doc(props.id);
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
                throw $error.errorHandler({ error });
            }
        });
    }
    /**
     * Get documents by collection
     * @typedef {Array<string>} OrderBy
     * @param {Object} props
     * @param {string} props.collection
     * @param {string} props.id
     * @param {string} props.subcollection
     * @param {string} props.subid
     * @param {string[]} props.where
     * @param {Array<OrderBy>} props.orderBy
     * @param {number} props.limit
     * @param {Object} props.startAfter
     * @returns {Promise<string[]>}
     * @memberof FirestoreAdapter
     * @example
     * const documents = await firestore.getDocs({
     *    collection: 'users'
     * })
     * const documents = await firestore.getDocs({
     *    collection: 'users',
     *    id: '1234567890',
     *    subcollection: 'posts'
     * })
     * const documents = await firestore.getDocs({
     *   collection: 'users',
     *   where: [['gender', '==', 'F']],
     *   orderBy: [['sortOrder', 'asc']['name', 'desc']],
     *   limit: 10,
     * })
     */
    getDocs(props) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection);
                if (props.id && props.subcollection) {
                    ref = ref.doc(props.id).collection(props.subcollection);
                }
                if (props.where) {
                    for (let w of props.where) {
                        if (w[0] === 'or' && Array.isArray(w[1])) {
                            let filterRef = Filter.or(...w[1].map((f) => {
                                return Filter.where(f[0], f[1], f[2]);
                            }));
                            ref = ref.where(filterRef);
                        }
                        else {
                            ref = ref.where(w[0], w[1], w[2]);
                        }
                    }
                }
                // Require an orderBy for pagination
                let orderBy;
                if (props.orderBy) {
                    orderBy = props.orderBy;
                    for (let o of orderBy) {
                        ref = ref.orderBy(o[0], o[1] || 'asc');
                    }
                }
                // Require a limit for pagination
                const limit = (_a = props.limit) !== null && _a !== void 0 ? _a : 1000;
                ref = ref.limit(limit);
                // Add startAfter for pagination when provided
                let clientSidePagination = (_b = props.clientSidePagination) !== null && _b !== void 0 ? _b : true;
                if (props.startAfter) {
                    // if is string, use getDoc and set ref.startAfter to result
                    // console.log(props.startAfter)
                    if (typeof props.startAfter === 'string') {
                        let getDoc = this.firestore
                            .collection(props.collection)
                            .doc(props.id ? props.id : props.startAfter);
                        if (props.subcollection) {
                            getDoc = getDoc
                                .collection(props.subcollection)
                                .doc(props.startAfter);
                        }
                        let result = yield getDoc.get();
                        // console.log(result.exists)
                        if (result.exists) {
                            ref = ref.startAfter(result);
                        }
                    }
                    else {
                        clientSidePagination = false;
                        ref = ref.startAfter(props.startAfter);
                    }
                }
                const snapshot = yield ref.get();
                const docs = snapshot.docs.map((doc) => {
                    return Object.assign({ id: doc.id }, doc.data());
                });
                let result = {
                    count: docs.length,
                    docs,
                };
                if (docs.length === limit) {
                    if (clientSidePagination) {
                        result.startAfter = snapshot.docs[snapshot.docs.length - 1].id;
                        console.log(result.startAfter);
                    }
                    else {
                        result.startAfter = snapshot.docs[snapshot.docs.length - 1];
                    }
                }
                return result;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    getGroupDocs(props) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collectionGroup(props.collection);
                if (props.where) {
                    for (let w of props.where) {
                        if (w[0] === 'or' && Array.isArray(w[1])) {
                            let filterRef = Filter.or(...w[1].map((f) => {
                                return Filter.where(f[0], f[1], f[2]);
                            }));
                            ref = ref.where(filterRef);
                        }
                        else {
                            ref = ref.where(w[0], w[1], w[2]);
                        }
                    }
                }
                // Require an orderBy for pagination
                const orderBy = (_a = props.orderBy) !== null && _a !== void 0 ? _a : 'created_at';
                ref = ref.orderBy(orderBy);
                // Require a limit for pagination
                const limit = (_b = props.limit) !== null && _b !== void 0 ? _b : 1000;
                ref = ref.limit(limit);
                // Add startAfter for pagination when provided
                if (props.startAfter) {
                    ref = ref.startAfter(props.startAfter);
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
                    result.startAfter = snapshot.docs[snapshot.docs.length - 1];
                }
                return result;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    getDocCount(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection);
                if (props.id && props.subcollection) {
                    ref = ref.doc(props.id).collection(props.subcollection);
                }
                if (props.where) {
                    for (let w of props.where) {
                        if (w[0] === 'or' && Array.isArray(w[1])) {
                            let filterRef = Filter.or(...w[1].map((f) => {
                                return Filter.where(f[0], f[1], f[2]);
                            }));
                            ref = ref.where(filterRef);
                        }
                        else {
                            ref = ref.where(w[0], w[1], w[2]);
                        }
                    }
                }
                const snapshot = yield ref.count().get();
                const count = snapshot.data().count;
                return count;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    addDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id;
                let ref = this.firestore.collection(props.collection);
                if (props.id && props.subcollection) {
                    id = props.subid ? props.subid : uuidv4();
                    ref = ref.doc(props.id).collection(props.subcollection).doc(id);
                }
                else {
                    id = props.id ? props.id : uuidv4();
                    ref = ref.doc(id);
                }
                yield ref.set(Object.assign({ created_at: new Date().valueOf(), id }, props.data));
                return id;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    replaceDoc(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.set(Object.assign({ updated_at: new Date().valueOf(), id: (_a = props.id) !== null && _a !== void 0 ? _a : uuidv4() }, props.data));
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    updateDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.update(Object.assign({ updated_at: new Date().valueOf() }, props.data));
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    deleteDoc(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.delete();
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    deleteDocs(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield this.getDocs(props);
                if (!exists.docs.length)
                    return true;
                const docs = exists.docs;
                const deleteBatch = this.firestore.batch();
                docs.forEach((doc) => {
                    if (props.subcollection) {
                        deleteBatch.delete(this.firestore
                            .collection(props.collection)
                            .doc(doc.id)
                            .collection(props.subcollection)
                            .doc(doc.id));
                    }
                    else {
                        deleteBatch.delete(this.firestore.collection(props.collection).doc(doc.id));
                    }
                });
                yield deleteBatch.commit();
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
    deleteDocField(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ref = this.firestore.collection(props.collection).doc(props.id);
                if (props.subcollection && props.subid) {
                    ref = ref.collection(props.subcollection).doc(props.subid);
                }
                yield ref.update({
                    updated_at: new Date().valueOf(),
                    [props.field]: FieldValue.delete(),
                });
                return true;
            }
            catch (error) {
                throw $error.errorHandler({ error });
            }
        });
    }
};
