# Overview

The promptmate.io API allows users to automate and integrate voice and messaging workflows seamlessly. With capabilities to send, receive, and manage voice calls and SMS in various applications, this API is pivotal for developers looking to create interactive and responsive communication tools. Leveraging Pipedream’s capacity for integrating APIs without server setup, developers can build powerful automations that trigger from incoming messages or calls, process data, and respond or redirect accordingly in real-time.

# Example Use Cases

- **Customer Support Automation**: Automatically trigger workflows in Pipedream when an SMS is received via promptmate.io. For instance, if a customer texts a support request, the API can capture this and trigger a workflow that logs the query in a CRM like HubSpot, sends an automated response confirming the receipt, and alerts the support team on Slack.

- **Event Reminder System**: Build a workflow where event attendees automatically receive reminders via SMS before the event starts. The workflow can be set to pull attendee data and scheduled times from a Google Sheets document, use promptmate.io to send out personalized reminder texts, and log responses in the sheet to track confirmations.

- **Feedback Collection System**: Utilize promptmate.io in a feedback loop system where after a service interaction, customers are prompted via SMS to provide feedback. The responses can be automatically collected and analyzed through Pipedream workflows, which could then update a database on Airtable and generate response summary reports sent via email with SendGrid.
