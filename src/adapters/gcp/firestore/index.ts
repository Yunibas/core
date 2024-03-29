export {}
const { Firestore, FieldValue, Filter } = require('@google-cloud/firestore')
const { v4: uuidv4 } = require('uuid')

const GoogleCloudAdapter = require('../GoogleCloudAdapter')
const { ErrorUtils } = require('../../../utils')

const $error = new ErrorUtils()

type TFirestorePropsObject = {
  projectId?: string
  databaseId?: string
}
type TFirestoreProps = TFirestorePropsObject | string
type TFirestoreCollection = {
  id: string
}
type TFirestoreDocData = {}
type TFirestoreDocRef = {
  parent: {}
  path: string
}
type TFirestoreDoc = {
  id: string
  data: () => TFirestoreDocData[]
  ref: TFirestoreDocRef
}
type TFirestoreGetDocProps = {
  collection: string
  id: string
  subcollection?: string
  subid?: string
}
type TFirestoreGetDocsProps = {
  collection: string
  id?: string
  subcollection?: string
  subid?: string
  where?: string[]
  orderBy?: string
  limit?: number
  startAfter?: string | object
  clientSidePagination?: boolean
}
type TFirestoreGetGroupDocsProps = {
  collection: string
  where?: string[]
  orderBy?: string
  limit?: number
  startAfter?: {}
}
type TFirestoreAddDocProps = {
  collection: string
  id?: string
  subcollection?: string
  subid?: string
  data: TFirestoreDocData
}
type TFirestoreUpdateDocProps = {
  collection: string
  id: string
  subcollection?: string
  subid?: string
  data: TFirestoreDocData
}
type TFirestoreDeleteDocProps = {
  collection: string
  id: string
  subcollection?: string
  subid?: string
}
type TFirestoreDeleteDocsProps = {
  collection: string
  id?: string
  subcollection?: string
  where: string[]
}
type TFirestoreDeleteDocFieldProps = {
  collection: string
  id: string
  subcollection?: string
  subid?: string
  field: string
}
type TFirestoreDocsResponse = {
  count: number
  startAfter?: {}
  docs: Record<string, unknown>[]
}

module.exports = class FirestoreAdapter extends GoogleCloudAdapter {
  constructor(props: TFirestoreProps) {
    super()
    this.firestore
    if (props && typeof props === 'object') {
      this.firestore = new Firestore(props)
    } else if (props && typeof props === 'string') {
      this.firestore = new Firestore({ projectId: props })
    } else {
      this.firestore = new Firestore()
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
  async listCollections(collection?: string, id?: string) {
    let result
    try {
      if (collection && id) {
        result = await this.firestore
          .collection(collection)
          .doc(id)
          .listCollections()
      } else {
        result = await this.firestore.listCollections()
      }
      return result.map((c: TFirestoreCollection) => c.id)
    } catch (error) {
      throw $error.errorHandler({ error })
    }
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
  async getDoc(props: TFirestoreGetDocProps) {
    try {
      let ref = this.firestore.collection(props.collection).doc(props.id)
      if (props.subcollection && props.subid) {
        ref = ref.collection(props.subcollection).doc(props.subid)
      }
      const result = await ref.get()
      if (result.exists) {
        return { id: props.id, ...result.data() }
      }
      return false
    } catch (error) {
      throw $error.errorHandler({ error })
    }
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
  async getDocs(props: TFirestoreGetDocsProps) {
    try {
      let ref = this.firestore.collection(props.collection)
      if (props.id && props.subcollection) {
        ref = ref.doc(props.id).collection(props.subcollection)
      }

      if (props.where) {
        for (let w of props.where) {
          if (w[0] === 'or' && Array.isArray(w[1])) {
            let filterRef = Filter.or(
              ...w[1].map((f: string[]) => {
                return Filter.where(f[0], f[1], f[2])
              })
            )
            ref = ref.where(filterRef)
          } else {
            ref = ref.where(w[0], w[1], w[2])
          }
        }
      }

      // Require an orderBy for pagination
      let orderBy
      if (props.orderBy) {
        orderBy = props.orderBy
        for (let o of orderBy) {
          ref = ref.orderBy(o[0], o[1] || 'asc')
        }
      }

      // Require a limit for pagination
      const limit = props.limit ?? 1000
      ref = ref.limit(limit)

      // Add startAfter for pagination when provided
      let clientSidePagination = props.clientSidePagination ?? true
      if (props.startAfter) {
        // if is string (doc.id), use getDoc and set ref.startAfter to result
        if (typeof props.startAfter === 'string') {
          let getDoc = this.firestore
            .collection(props.collection)
            .doc(props.id ? props.id : props.startAfter)
          if (props.subcollection) {
            getDoc = getDoc
              .collection(props.subcollection)
              .doc(props.startAfter)
          }
          let result = await getDoc.get()
          if (result.exists) {
            ref = ref.startAfter(result)
          }
        } else {
          clientSidePagination = false
          ref = ref.startAfter(props.startAfter)
        }
      }

      const snapshot = await ref.get()
      const docs = snapshot.docs.map((doc: TFirestoreDoc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })

      let result: TFirestoreDocsResponse = {
        count: docs.length,
        docs,
      }

      if (docs.length === limit) {
        if (clientSidePagination) {
          result.startAfter = snapshot.docs[snapshot.docs.length - 1].id
        } else {
          result.startAfter = snapshot.docs[snapshot.docs.length - 1]
        }
      }
      return result
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async getGroupDocs(props: TFirestoreGetGroupDocsProps) {
    try {
      let ref = this.firestore.collectionGroup(props.collection)

      if (props.where) {
        for (let w of props.where) {
          if (w[0] === 'or' && Array.isArray(w[1])) {
            let filterRef = Filter.or(
              ...w[1].map((f: string[]) => {
                return Filter.where(f[0], f[1], f[2])
              })
            )
            ref = ref.where(filterRef)
          } else {
            ref = ref.where(w[0], w[1], w[2])
          }
        }
      }

      // Require an orderBy for pagination
      const orderBy = props.orderBy ?? 'created_at'
      ref = ref.orderBy(orderBy)

      // Require a limit for pagination
      const limit = props.limit ?? 1000
      ref = ref.limit(limit)

      // Add startAfter for pagination when provided
      if (props.startAfter) {
        ref = ref.startAfter(props.startAfter)
      }

      const snapshot = await ref.get()
      const docs = snapshot.docs.map((doc: TFirestoreDoc) => {
        const path = doc.ref.path.split('/')
        return {
          id: doc.id,
          parent_collection: path[0],
          parent_doc: path[1],
          ...doc.data(),
        }
      })

      let result: TFirestoreDocsResponse = {
        count: docs.length,
        docs,
      }
      if (docs.length === limit) {
        result.startAfter = snapshot.docs[snapshot.docs.length - 1]
      }
      return result
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async getDocCount(props: TFirestoreGetDocsProps) {
    try {
      let ref = this.firestore.collection(props.collection)
      if (props.id && props.subcollection) {
        ref = ref.doc(props.id).collection(props.subcollection)
      }

      if (props.where) {
        for (let w of props.where) {
          if (w[0] === 'or' && Array.isArray(w[1])) {
            let filterRef = Filter.or(
              ...w[1].map((f: string[]) => {
                return Filter.where(f[0], f[1], f[2])
              })
            )
            ref = ref.where(filterRef)
          } else {
            ref = ref.where(w[0], w[1], w[2])
          }
        }
      }

      const snapshot = await ref.count().get()
      const count = snapshot.data().count
      return count
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async addDoc(props: TFirestoreAddDocProps) {
    try {
      let id

      let ref = this.firestore.collection(props.collection)
      if (props.id && props.subcollection) {
        id = props.subid ? props.subid : uuidv4()
        ref = ref.doc(props.id).collection(props.subcollection).doc(id)
      } else {
        id = props.id ? props.id : uuidv4()
        ref = ref.doc(id)
      }
      await ref.set({
        created_at: new Date().valueOf(),
        id,
        ...props.data,
      })
      return id
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async replaceDoc(props: TFirestoreUpdateDocProps) {
    try {
      let ref = this.firestore.collection(props.collection).doc(props.id)
      if (props.subcollection && props.subid) {
        ref = ref.collection(props.subcollection).doc(props.subid)
      }
      await ref.set({
        updated_at: new Date().valueOf(),
        id: props.id ?? uuidv4(),
        ...props.data,
      })
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async updateDoc(props: TFirestoreUpdateDocProps) {
    try {
      let ref = this.firestore.collection(props.collection).doc(props.id)
      if (props.subcollection && props.subid) {
        ref = ref.collection(props.subcollection).doc(props.subid)
      }
      await ref.update({
        updated_at: new Date().valueOf(),
        ...props.data,
      })
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async deleteDoc(props: TFirestoreDeleteDocProps) {
    try {
      let ref = this.firestore.collection(props.collection).doc(props.id)
      if (props.subcollection && props.subid) {
        ref = ref.collection(props.subcollection).doc(props.subid)
      }
      await ref.delete()
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async deleteDocs(props: TFirestoreDeleteDocsProps) {
    try {
      const exists = await this.getDocs(props)
      if (!exists.docs.length) return true

      const docs = exists.docs
      const deleteBatch = this.firestore.batch()
      docs.forEach((doc) => {
        if (props.subcollection) {
          deleteBatch.delete(
            this.firestore
              .collection(props.collection)
              .doc(doc.id)
              .collection(props.subcollection)
              .doc(doc.id)
          )
        } else {
          deleteBatch.delete(
            this.firestore.collection(props.collection).doc(doc.id)
          )
        }
      })
      await deleteBatch.commit()
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  async deleteDocField(props: TFirestoreDeleteDocFieldProps) {
    try {
      let ref = this.firestore.collection(props.collection).doc(props.id)
      if (props.subcollection && props.subid) {
        ref = ref.collection(props.subcollection).doc(props.subid)
      }
      await ref.update({
        updated_at: new Date().valueOf(),
        [props.field]: FieldValue.delete(),
      })
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }
}
