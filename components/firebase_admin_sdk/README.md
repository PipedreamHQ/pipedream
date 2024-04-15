# Overview

The Firebase Admin SDK API empowers you to programmatically manage your Firebase project's backend services like Firestore, Firebase Realtime Database, Firebase Storage, and Firebase Authentication. With Pipedream, you can craft serverless workflows integrating the Firebase Admin SDK, leveraging its capabilities to automate tasks, sync data across platforms, and manage users or data in real time.

# Example Use Cases

- **User Account Sync Workflow**: Automatically sync user account information between Firebase Authentication and third-party CRM platforms such as HubSpot. When a new user signs up or updates their profile in your app, reflect those changes in your CRM in real time to keep records consistent and up-to-date.

- **Database Backup and Archival**: Schedule daily or weekly workflows to back up data from Firestore or Firebase Realtime Database to external storage services like Amazon S3 or Google Cloud Storage. Guarantee data durability and compliance by reliably storing snapshots outside of the Firebase ecosystem.

- **Real-Time Data Processing Pipeline**: Connect Firebase with a real-time event processing service like AWS Lambda. Trigger functions upon changes in Firestore documents or Realtime Database entries, process the data, and then push results back to Firebase or other endpoints, facilitating complex analytics or data enrichment tasks.
