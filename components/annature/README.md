# Overview

Annature API enables integrations with their digital signature platform, allowing you to automate the e-signature process for documents. By leveraging Pipedream, you can create workflows that interact with Annature to send documents, monitor their status, and handle signed documents seamlessly. The API's functionality can be used to craft custom notifications, synchronize signed documents with other services, and trigger processes when documents are fully signed.

## Example Annature Workflows on Pipedream

- **Automate Sending Contracts for Signature**: Create a workflow in Pipedream that listens for new entries in a Google Sheets spreadsheet. When a new entry is detected, Pipedream automatically sends a document from Annature for signature to the specified recipients. After sending, log the action in a separate sheet for tracking.

- **Document Signature Status Tracking**: Set up a webhook in Pipedream that receives status updates from Annature every time a document's signature status changes. Use these updates to trigger emails via SendGrid, informing stakeholders of the document's progress or completion.

- **Synchronize Signed Documents to Cloud Storage**: Upon receiving a webhook indicating a document has been fully signed, deploy a Pipedream workflow to download the signed document and upload it to a Dropbox folder. This can be extended to update a record in a Salesforce CRM to mark a deal as closed.
