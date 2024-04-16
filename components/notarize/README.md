# Overview

The Notarize API allows for seamless integration of remote electronic notarization into your digital workflow, enabling documents to be legally notarized online. By leveraging Pipedream's serverless platform, you can automate the notarization process, sync it with your business applications, and respond to notarization events in real-time. This could range from auto-submitting documents for notarization, updating customer records, to sending notifications upon completion of notarizations.

# Example Use Cases

- **Automated Document Submission for Notarization**: Trigger a workflow in Pipedream when a document is ready for notarization in your system (e.g., a CRM). The workflow uploads the document to Notarize, submits it for notarization, and then captures the notarization status, updating the CRM record with the new status.

- **Real-Time Notarization Updates to Slack**: Set up a Pipedream workflow that listens for webhook events from Notarize indicating the status of document notarization. On receiving a completed notarization event, the workflow sends a notification to a designated Slack channel, providing the team with instant updates about the notarization process.

- **Automated Follow-Up Emails Post-Notarization**: Create a Pipedream workflow that, upon successful notarization of a document, triggers an automated email to the relevant parties. The email could contain the notarized document or a link to download it, and integrates with an email service like SendGrid for email delivery, ensuring participants receive the necessary documents without delay.
