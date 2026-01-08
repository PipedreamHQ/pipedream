# Overview

BunnyDoc API allows for efficient handling of document creation, manipulation, and retrieval. Leveraging BunnyDoc on Pipedream can automate the workflows involving document handling that are often manual and time-consuming. This can include generating reports, updating document content based on dynamic data sources, or even systematic filing and organization of documents in cloud storage platforms.

# Example Use Cases

- **Automated Invoice Generation**: Automatically generate and send invoices to customers by integrating BunnyDoc with a CRM like Salesforce. Whenever a new sale is recorded in Salesforce, trigger a Pipedream workflow to create a customized invoice using BunnyDoc, and then email it directly to the customer via SendGrid or a similar email service.

- **Dynamic Contract Creation**: Use BunnyDoc to create personalized contracts when new employee details are added to an HR management system like BambooHR. A Pipedream workflow can listen for new employee records, use BunnyDoc to populate a contract template with specific details, and then store the final document in a secure location like Google Drive.

- **Real-time Reporting**: Configure a workflow that integrates BunnyDoc with Google Sheets to generate real-time reports. Whenever data in a specific Google Sheets spreadsheet is updated or a new row is added, use Pipedream to trigger the BunnyDoc API to create a detailed report, which can then be automatically shared with stakeholders through platforms like Slack or email.
