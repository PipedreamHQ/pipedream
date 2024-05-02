# Overview

The DocuSign Developer API enables automation around electronic agreements, signatures, and approval processes. It's a powerful tool for streamlining document workflows, allowing you to create, send, and manage documents programmatically. With Pipedream, you can harness this capability to integrate DocuSign seamlessly with other services, triggering actions based on document status, automating follow-ups, syncing data with CRM systems, and more.

# Example Use Cases

- **Automated Contract Workflow**: When a new contract is uploaded to a Google Drive folder, Pipedream detects the file, triggers the DocuSign API to send the contract for signature, and upon completion, saves the signed version back to Google Drive. This eliminates manual handling and speeds up contract execution.

- **CRM Integration for Signed Agreements**: Once a document is signed in DocuSign, Pipedream updates the corresponding deal or contact in Salesforce with the status. It could also attach the signed document to the CRM record, ensuring sales teams have immediate access to the final agreements.

- **Document Status Notifications**: Set up a Pipedream workflow that listens for status changes in DocuSign documents, such as completions or rejections. When a change is detected, Pipedream sends a real-time notification via Slack to the relevant parties, keeping everyone in the loop without manual checks.
