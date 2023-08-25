// TODO: Rewrite for use as package

const { Storage } = require('@google-cloud/storage')

const storage = new Storage()

module.exports = function useStorage() {
   const listBuckets = async () => {
      try {
         const result = await storage.getBuckets()
         const buckets = result[0]
         return buckets.map((bucket) => bucket.name)
      } catch (error) {
         throw new Error(error)
      }
   }

   const createBucket = async (bucketName) => {
      try {
         const [bucket] = await storage.createBucket(bucketName, {
            location: 'us-central1',
         })
         return bucket
      } catch (error) {
         throw new Error(error)
      }
   }

   const deleteBucket = async (bucketName) => {
      try {
         await storage.bucket(bucketName).delete()
         return true
      } catch (error) {
         throw new Error(error)
      }
   }

   const listFiles = async ({ bucketName, options }) => {
      try {
         const [files] = await storage.bucket(bucketName).getFiles(options)
         return files
      } catch (error) {
         throw new Error(error)
      }
   }

   const saveFile = async ({ bucketName, destFileName, contents }) => {
      try {
         await storage.bucket(bucketName).file(destFileName).save(contents)
         return true
      } catch (error) {
         throw new Error(error)
      }
   }

   const deleteFile = async ({ bucketName, fileName }) => {
      try {
         await storage.bucket(bucketName).file(fileName).delete()
         return true
      } catch (error) {
         throw new Error(error)
      }
   }

   const openFile = async ({ bucketName, fileName }) => {
      try {
         const contents = await storage
            .bucket(bucketName)
            .file(fileName)
            .download()
         return contents
      } catch (error) {
         throw new Error(error)
      }
   }

   const renameFile = async ({ bucketName, srcFileName, destFileName }) => {
      try {
         await storage.bucket(bucketName).file(srcFileName).rename(destFileName)
         return true
      } catch (error) {
         throw new Error(error)
      }
   }

   const copyFile = async ({
      srcBucketName,
      srcFileName,
      destBucketName,
      destFileName,
   }) => {
      try {
         const srcBucket = storage.bucket(srcBucketName)
         const srcFile = srcBucket.file(srcFileName)
         const destBucket = storage.bucket(destBucketName)
         const destFile = destBucket.file(destFileName)
         await srcFile.copy(destFile)
         return true
      } catch (error) {
         throw new Error(error)
      }
   }

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
   }
}
