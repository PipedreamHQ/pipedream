# Overview

The Edusign API provides a suite of tools for managing electronic signatures and documents. Within Pipedream, you can use this API to automate workflows related to document preparation, signing processes, and post-signature tasks. By connecting to other apps available on Pipedream, such as CRMs, cloud storage, or communication tools, you can create seamless integrations for handling documents across various stages of your business processes.

# Example Use Cases

- **Automated Document Workflow Creation**: Upon receiving a new customer form submission from your website (e.g., via a Webhook), use the Edusign API to generate a signature request and send it to the customer. Once the document is signed, trigger an update in your CRM system with the signatory's data.

- **Document Status Tracking**: Set up a workflow where you check the status of sent documents periodically. When a document is signed or if there's an update, use Pipedream to notify your team in Slack and archive the completed document in Google Drive.

- **Onboarding Process Streamlining**: Automate your employee onboarding by triggering an Edusign signature request for employment contracts when a new hire is added to your HR system. Then, secure storage of the signed contracts can be ensured by uploading them to Dropbox and notifying the HR team through Microsoft Teams.
