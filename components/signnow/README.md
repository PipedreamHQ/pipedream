# Overview

The signNow API on Pipedream facilitates the automation and integration of electronic signature workflows directly within your apps. Using signNow, you can create, send, and manage documents requiring signatures, enhancing the efficiency and automation of business processes that depend on legally binding documents. This integration particularly shines in scenarios where documents need to be signed by multiple parties, tracked, and managed systematically.

# Example Use Cases

- **Contract Signing and Notification System**: Automate the process of sending contracts for signature and notifying relevant parties upon completion. When a contract is uploaded to a specific folder in Google Drive, use Pipedream to trigger an event that sends the document to signNow for signatures. Once signed, automatically email the signed contract to all concerned parties and update a database record to show the completion of the process.

- **Employee Onboarding Document Management**: Streamline the employee onboarding process by automatically sending employment-related documents for signature through signNow when a new employee record is added to an HR management system like BambooHR. After the documents are signed, store them in a secure Dropbox folder and update the HR system to reflect the completed onboarding paperwork.

- **Customer Agreement Renewals**: Automate the renewal of customer agreements by integrating signNow with a CRM platform such as Salesforce. Set up a workflow that identifies agreements due for renewal, sends them out via signNow for re-signature, and upon completion, updates the status in Salesforce and notifies the account manager via Slack.
