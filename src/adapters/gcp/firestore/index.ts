export {}
const { Firestore } = require('@google-cloud/firestore')
const { v4: uuidv4 } = require('uuid')

const GoogleCloudAdapter = require('../GoogleCloudAdapter')

type TFirestoreProps = {
  projectId?: string
  databaseId?: string
}
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
  startAt?: {}
}
type TFirestoreGetGroupDocsProps = {
  collection: string
  where?: string[]
  orderBy?: string
  limit?: number
  startAt?: {}
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
type TFirestoreDocsResponse = {
  count: number
  startAt?: {}
  docs: Record<string, unknown>[]
}

module.exports = class FirestoreAdapter extends GoogleCloudAdapter {
  constructor(props: TFirestoreProps) {
    super()
    this.firsestore = null
    if (props && typeof props === 'object') {
      const settings = props.projectId ? { projectId: props.projectId } : {}
      this.firestore = new Firestore(settings, props?.databaseId ?? null)
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
      // @ts-ignore
      throw new Error(error)
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
      // @ts-ignore
      throw new Error(error)
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
   * @param {Object} props.startAt
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
   *   where: ['gender', '==', 'F'],
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
          ref = ref.where(w[0], w[1], w[2])
        }
      }

      // Require an orderBy for pagination
      // if (props.orderBy) ref = ref.orderBy(props.orderBy)
      if (props.orderBy) {
        for (let o of props.orderBy) {
          ref = ref.orderBy(o[0], o[1] || 'asc')
        }
      }

      // Require a limit for pagination
      let limit = 0
      if (props.orderBy) {
        limit = props.limit ?? 1000
        ref = ref.limit(limit ?? 1000)
      }

      // Add startAt for pagination when provided
      if (props.startAt) {
        ref = ref.startAt(props.startAt)
      }

      const snapshot = await ref.get()
      let docs: Record<string, unknown>[] = []
      snapshot.forEach((doc: TFirestoreDoc) => {
        docs.push({ id: doc.id, ...doc.data() })
      })

      let result: TFirestoreDocsResponse = {
        count: snapshot.docs.length,
        docs,
      }
      if (limit && snapshot.docs.length === limit) {
        const last = snapshot.docs[snapshot.docs.length - 1]
        if (props.orderBy) result.startAt = last.data()[props.orderBy]
      }
      return result
    } catch (error) {
      // @ts-ignore
      throw new Error(error)
    }
  }

  async getGroupDocs(props: TFirestoreGetGroupDocsProps) {
    try {
      let ref = this.firestore.collectionGroup(props.collection)

      if (props.where) {
        ref = ref.where(props.where)
      }

      // Require an orderBy for pagination
      const orderBy = props.orderBy ?? 'created_at'
      ref = ref.orderBy(orderBy)

      // Require a limit for pagination
      const limit = props.limit ?? 1000
      ref = ref.limit(limit ?? 1000)

      // Add startAt for pagination when provided
      if (props.startAt) {
        ref = ref.startAt(props.startAt)
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
        const last = docs[docs.length - 1]
        result.startAt = last.data()[orderBy]
      }
      return result
    } catch (error) {
      // @ts-ignore
      console.error(error.code, error.details, error.metadata)
      // @ts-ignore
      throw new Error(error)
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
      // @ts-ignore
      throw new Error(error)
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
      // @ts-ignore
      throw new Error(error)
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
      // @ts-ignore
      throw new Error(error)
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
      // @ts-ignore
      throw new Error(error)
    }
  }
}
