# Overview

The Jobber API allows for the automation of service business operations, such as scheduling jobs, managing clients, and invoicing. By pairing it with Pipedream, you can craft powerful serverless workflows that react to events in Jobber or integrate with other services to streamline your business processes. With Pipedream’s ability to connect to 3,000+ apps, you can create custom automations without writing a lot of code, handling everything from data transformations to complex logic.

# Example Use Cases

- **Job Completion to Invoice Generation**: Once a job is marked as completed in Jobber, a workflow in Pipedream automatically generates an invoice for that job, attaches a report if needed, and sends it to the customer, streamlining the billing process.

- **Client Onboarding Automation**: When a new client is added to Jobber, Pipedream triggers a workflow that sends a welcome email using SendGrid, creates a new contact in HubSpot, and schedules an initial consultation call on Google Calendar, ensuring no step in the onboarding process is missed.

- **Real-time Job Updates to Slack**: Keep your team informed with real-time updates by using Pipedream to send a notification to a designated Slack channel whenever the status of a job in Jobber changes. This ensures everyone is up to speed with the current status without having to check Jobber directly.
