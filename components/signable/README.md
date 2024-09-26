# Overview

The Signable API allows for the automation of electronic signature processes. Integrating this API into Pipedream workflows enables users to create, send, and manage documents that require signatures, streamlining the handling of contracts and agreements. By leveraging this API, you can automate notifications, sync data with other services, or initiate signature requests as part of larger automated business processes.

# Example Use Cases

- **Automated Document Workflow**: When a new document is uploaded to Google Drive, automatically create and send a signature request for it using Signable. Once signed, the document is then saved back to a designated Google Drive folder.

- **Signature Status Tracking**: Create a workflow that listens for webhook events from Signable to track the status of signature requests. With each update, sync the status to a row in Google Sheets, allowing for a live dashboard of document statuses.

- **Onboarding Process Automation**: For new employee onboarding, trigger a Pipedream workflow that sends out necessary employment documents via Signable when a new record is added to an HR system, such as BambooHR. Follow up with an email confirmation to the HR team once all documents are signed.
