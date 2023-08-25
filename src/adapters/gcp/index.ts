const BigQueryAdapter = require('./bigquery')
const FirestoreAdapter = require('./firestore')
const LoggingAdapter = require('./logging')
const PubSubAdapter = require('./pubsub')
const StorageAdapter = require('./storage')

module.exports = {
   BigQueryAdapter,
   FirestoreAdapter,
   LoggingAdapter,
   PubSubAdapter,
   StorageAdapter,
}
