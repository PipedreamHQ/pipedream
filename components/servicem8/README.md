# Overview

The ServiceM8 API allows businesses to streamline their field service management by automating tasks and integrating with other tools. Through Pipedream, you can harness this API to create custom workflows that trigger actions within ServiceM8 or sync data with other apps. Automate job scheduling, dispatching, invoicing, and more by reacting to events in real-time. Enhance productivity by connecting ServiceM8 to CRMs, accounting software, or custom databases, ensuring consistent and updated information across platforms.

# Example Use Cases

- **Job Status to Slack Notifications**: Whenever a job status is updated in ServiceM8, trigger a Pipedream workflow that sends a customized message to a designated Slack channel. This keeps teams immediately informed about job progress without manually checking the ServiceM8 app.

- **Automated Invoicing with QuickBooks**: Create a workflow that detects job completion in ServiceM8 and automatically generates an invoice in QuickBooks. This eliminates the need to manually enter data, reducing errors, and accelerating the billing cycle.

- **Dynamic Scheduling with Google Calendar**: Sync ServiceM8 job bookings with a Google Calendar, updating the calendar in real-time when new jobs are scheduled or existing ones are modified. This improves coordination and ensures that all stakeholders have visibility into the schedule.

# Actions (REST API)

These actions call the [ServiceM8 REST API](https://developer.servicem8.com/docs/rest-overview) and related endpoints. Use **Make API Request** for paths not wrapped below. OAuth tokens must include the scopes required for each operation (for example `read_jobs`, `manage_jobs`, `publish_sms`).

**Jobs, clients, and operations:** list/get/create/update/delete for jobs, companies, company contacts, job materials, job activities, staff, queues, categories, badges, notes, attachments (`dboattachment`), job payments, job contacts, and feedback.

**Messaging:** [Send SMS](https://developer.servicem8.com/reference/send_sms), [Send Email](https://developer.servicem8.com/reference/send_email) (Messaging API; public apps / quotas apply).

**Webhooks:** list, create, and delete webhook subscriptions ([Webhooks overview](https://developer.servicem8.com/docs/webhooks-overview)).

**Filtering:** list actions support `$filter`, `$sort`, and `cursor` query parameters per the [filtering](https://developer.servicem8.com/docs/filtering) and pagination docs.
