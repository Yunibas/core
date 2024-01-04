[< Back to Services](../README.md)

# Google Cloud Platform Adapters

This directory includes adapters for services found on the Google Cloud Platform.

To authorize these calls locally you must set your GOOGLE_APPLICATION_CREDENTIALS pointed to the full path of a service account JSON file.

Deploying as a Google Cloud Function will take on the permissions of the service account assigned.

Currently, these adapters do not support running in any other environment.

[BigQuery Adapter](./bigquery/README.md)

[Cloud Logging Adapter](./logging/README.md)

[Firestore Adapter](./firestore/README.md)

[PubSub Adapter](./pubsub/README.md)
