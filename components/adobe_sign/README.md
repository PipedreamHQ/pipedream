# Overview

Adobe Acrobat Sign API allows for the automation of document signing processes. It provides endpoints to manage agreements, create and send documents for signature, track document status, and more. By using it within Pipedream, you can craft workflows that react to events in real-time, automate document updates, and integrate e-signature processes with other apps and services. The API opens doors to streamline how contracts and agreements are handled in a business workflow, cutting down on manual tasks and driving efficiency.

## Example Adobe Acrobat Sign Workflows on Pipedream

1. **Automate Document Sending after Form Submission**: When a customer submits a form via Typeform, trigger a Pipedream workflow that uses the Adobe Acrobat Sign API to send them a contract for signature, passing the customer's details into the document template.

2. **Update CRM upon Agreement Completion**: Set up a workflow that listens for a webhook from Adobe Acrobat Sign indicating an agreement is completed. Use this to trigger an API call to update the deal status in a CRM like Salesforce, recording the signed agreement details.

3. **Sync Signed Documents to Cloud Storage**: Create a Pipedream workflow that triggers when Adobe Acrobat Sign sends a webhook notification of a signed document. The workflow would then retrieve the signed document using the API and upload it to a cloud storage service like Google Drive, organizing signed contracts for easy access and compliance.
