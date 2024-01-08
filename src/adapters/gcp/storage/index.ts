export {}
const { Storage } = require('@google-cloud/storage')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const { ErrorUtils } = require('../../../utils')

const $error = new ErrorUtils()

type TBucketName = string
type TCreateBucketProps = {
  bucketName: TBucketName
  location?: string
}
type TListFilesProps = {
  bucketName: TBucketName
  options: Record<string, any>
}
type TSaveFileProps = {
  bucketName: TBucketName
  fileName: string
  content: string
}
type TDeleteFileProps = {
  bucketName: TBucketName
  fileName: string
}
type TDownloadFileProps = {
  bucketName: TBucketName
  fileName: string
  destination: string
}
type TRenameFileProps = {
  bucketName: TBucketName
  fileName: string
  newFileName: string
}
type TCopyFileProps = {
  bucketName: TBucketName
  fileName: string
  newBucketName?: string
  newFileName?: string
}
type TMoveFileProps = {
  bucketName: TBucketName
  fileName: string
  newBucketName: string
}
type TProjectId = string
type TStorageProps = {
  projectId?: string
}

module.exports = class StorageAdapter extends GoogleCloudAdapter {
  constructor(props: TProjectId | TStorageProps) {
    super()
    this.storage
    if (props && typeof props === 'object') {
      const payload = props.projectId ? { projectId: props.projectId } : {}
      this.storage = new Storage(payload)
    } else if (props && typeof props === 'string') {
      const payload = { projectId: props }
      this.storage = new Storage(payload)
    } else {
      this.storage = new Storage()
    }
  }

  listBuckets = async () => {
    try {
      let [buckets] = await this.storage.getBuckets()
      return buckets
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  createBucket = async (props: TCreateBucketProps) => {
    try {
      let { bucketName, location = 'us-central1' } = props
      let [exists] = await this.storage.bucket(bucketName).exists()
      let bucket
      if (!exists) {
        ;[bucket] = await this.storage.createBucket(bucketName, { location })
      }
      return bucket
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  deleteBucket = async (bucketName: TBucketName) => {
    try {
      await this.storage.bucket(bucketName).deleteFiles({ force: true })
      await this.storage.bucket(bucketName).delete()
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  listFiles = async (props: TListFilesProps) => {
    try {
      let { bucketName, options } = props
      let [files] = await this.storage.bucket(bucketName).getFiles(options)
      return files
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  saveFile = async (props: TSaveFileProps) => {
    try {
      let { bucketName, fileName, content } = props
      let file = this.storage.bucket(bucketName).file(fileName)
      await file.save(content)
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  deleteFile = async (props: TDeleteFileProps) => {
    try {
      let { bucketName, fileName } = props
      let file = this.storage.bucket(bucketName).file(fileName)
      await file.delete()
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  downloadFile = async (props: TDownloadFileProps) => {
    try {
      let { bucketName, fileName, destination } = props
      let file = this.storage.bucket(bucketName).file(fileName)
      await file.download({ destination })
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  renameFile = async (props: TRenameFileProps) => {
    try {
      let { bucketName, fileName, newFileName } = props
      let file = this.storage.bucket(bucketName).file(fileName)
      await file.rename(newFileName)
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  moveFile = async (props: TMoveFileProps) => {
    try {
      let { bucketName, fileName, newBucketName } = props
      let file = this.storage.bucket(bucketName).file(fileName)
      let destination = this.storage.bucket(newBucketName)
      await file.move(destination)
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }

  copyFile = async (props: TCopyFileProps) => {
    try {
      let { bucketName, fileName, newBucketName, newFileName } = props
      if (!newBucketName && !newFileName) {
        throw $error.errorHandler(
          'You must provide a new bucket name or a new file name'
        )
      }

      let file = this.storage.bucket(bucketName).file(fileName)
      let destination = this.storage.bucket(bucketName).file(newFileName)
      if (newBucketName) {
        if (newFileName) {
          destination = this.storage.bucket(newBucketName).file(newFileName)
        } else {
          destination = this.storage.bucket(newBucketName).file(fileName)
        }
      }
      await file.copy(destination)
      return true
    } catch (error) {
      throw $error.errorHandler({ error })
    }
  }
}
