# Overview

The Adobe Acrobat Sign API lets you embed e-signature processes into your custom applications, automate document workflows, and manage e-signatures. Specifically within Pipedream, you can harness this API to build serverless workflows that automate document signing requests, track status changes, and manage signed documents without ever leaving the platform. You can create workflows that trigger on various events, send out documents to be signed, and handle the responses—all programmatically.

# Example Use Cases

- **Automated Contract Signing Workflow**: When a new contract is uploaded to a Google Drive folder, Pipedream detects the upload and triggers a workflow that sends the document to specified recipients for e-signature via Adobe Acrobat Sign. Once signed, the document is then automatically saved back to Google Drive and the signatories receive a confirmation email.

- **Onboarding Paperwork Automation**: As soon as a new employee record is added to an HR system like BambooHR, Pipedream triggers a workflow that sends the necessary onboarding documents for signature through Adobe Acrobat Sign. The workflow tracks the status of the document, and upon completion, updates the HR system and notifies the team via Slack.

- **Sales Quote Approval Process**: When a new sales quote is created in a CRM like Salesforce, Pipedream triggers an automated workflow that sends the quote for approval using Adobe Acrobat Sign. Once the quote is signed by the required parties, the workflow updates the deal status in Salesforce and sends a notification to the sales team in Microsoft Teams.
