export {}
const { BigQuery } = require('@google-cloud/bigquery')
const GoogleCloudAdapter = require('../GoogleCloudAdapter')

const bigquery = new BigQuery()

type TGoogleCloudLocation = string
type TCloudStorageInstance = {
   bucket: (name: string) => {
      file: (name: string) => {}
   }
}
type TBigQueryDatasetName = string
type TBigQueryTableName = string
type TBigQueryCreateDatasetProps = {
   name: string
   location: string
}
type TBigQueryGetDatasetProps = {
   name: TBigQueryDatasetName
   location: TGoogleCloudLocation
}
type TBigQueryLoadFromBucketProps = {
   dataset: TBigQueryDatasetName
   location: TGoogleCloudLocation
   table: TBigQueryTableName
   storage: TCloudStorageInstance
   bucketName: string
   fileName: string
   sourceFormat: string
   skipLeadingRows: number
   schema: {}
}
type TBigQueryRunQueryProps = {
   sql: string
   location: string
}

module.exports = class BigQueryAdapter extends GoogleCloudAdapter {
   constructor() {
      super()
   }

   async createDataset({
      name,
      location = 'us-central1',
   }: TBigQueryCreateDatasetProps) {
      try {
         const [dataset] = await bigquery.dataset(name).create({
            location,
         })
         return dataset
      } catch (error) {
         // @ts-ignore
         throw new Error(error)
      }
   }

   async getDataset({
      name,
      location = 'us-central1',
   }: TBigQueryGetDatasetProps) {
      try {
         const [dataset] = await bigquery.dataset(name).get({
            location,
         })
         return dataset
      } catch (error) {
         // @ts-ignore
         throw new Error(error)
      }
   }

   async deleteDataset(name: TBigQueryDatasetName) {
      try {
         await bigquery.dataset(name).delete({ force: true })
         return true
      } catch (error) {
         // @ts-ignore
         throw new Error(error)
      }
   }

   async loadFromBucket(props: TBigQueryLoadFromBucketProps) {
      try {
         const fileRef = props.storage
            .bucket(props.bucketName)
            .file(props.fileName)
         const [job] = await bigquery
            .dataset(props.dataset)
            .table(props.table)
            .load(fileRef, {
               sourceFormat: props.sourceFormat ?? 'CSV',
               skipLeadingRows: props.skipLeadingRows ?? 0,
               schema: props.schema,
               location: props.location ?? 'us-central1',
            })
         if (job.status.errors && job.status.errors.length > 0) {
            throw new Error(job.status.errors)
         }
         return true
      } catch (error) {
         // @ts-ignore
         throw new Error(error)
      }
   }

   async runQuery(props: TBigQueryRunQueryProps) {
      try {
         const [job] = await bigquery.createQueryJob({
            query: props.sql,
            location: props.location ?? 'us-central1',
         })
         const [rows] = await job.getQueryResults()
         return rows
      } catch (error: unknown) {
         let message
         if (error instanceof Error) message = error.message
         else message = String(error)
         console.error('runQuery', message)
         throw new Error(message)
      }
   }
}
