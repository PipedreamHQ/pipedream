# Overview

The ServiceM8 API allows businesses to streamline their field service management by automating tasks and integrating with other tools. Through Pipedream, you can harness this API to create custom workflows that trigger actions within ServiceM8 or sync data with other apps. Automate job scheduling, dispatching, invoicing, and more by reacting to events in real-time. Enhance productivity by connecting ServiceM8 to CRMs, accounting software, or custom databases, ensuring consistent and updated information across platforms.

# Example Use Cases

- **Job Status to Slack Notifications**: Whenever a job status is updated in ServiceM8, trigger a Pipedream workflow that sends a customized message to a designated Slack channel. This keeps teams immediately informed about job progress without manually checking the ServiceM8 app.

- **Automated Invoicing with QuickBooks**: Create a workflow that detects job completion in ServiceM8 and automatically generates an invoice in QuickBooks. This eliminates the need to manually enter data, reducing errors, and accelerating the billing cycle.

- **Dynamic Scheduling with Google Calendar**: Sync ServiceM8 job bookings with a Google Calendar, updating the calendar in real-time when new jobs are scheduled or existing ones are modified. This improves coordination and ensures that all stakeholders have visibility into the schedule.

# Actions (REST API)

These actions call the [ServiceM8 REST API](https://developer.servicem8.com/docs/rest-overview) and related endpoints. ServiceM8 does not publish an official Node.js SDK; integration uses the documented REST endpoints. Use **Make API Request** for paths not wrapped below. OAuth tokens must include the scopes required for each operation (for example `read_jobs`, `manage_jobs`, `publish_sms`).

**Jobs, clients, and operations:** list/get/create/update/delete for jobs, companies, company contacts, job materials, job activities, staff, queues, categories, badges, notes, attachments (`dboattachment`), job payments, job contacts, feedback, materials, tasks, assets, locations, and bundles. **Allocation Windows:** list/get (read-only; time periods for job scheduling). Full coverage aligned with [ServiceM8 REST API reference](https://developer.servicem8.com/reference).

**Messaging:** [Send SMS](https://developer.servicem8.com/reference/send_sms), [Send Email](https://developer.servicem8.com/reference/send_email) (Messaging API; public apps / quotas apply).

**Webhooks:** list, create, and delete webhook subscriptions ([Webhooks overview](https://developer.servicem8.com/docs/webhooks-overview)).

## Filtering and pagination

List actions support `$filter`, `$sort`, and `cursor` query parameters per the [filtering](https://developer.servicem8.com/docs/filtering) and pagination docs. To process **all** pages, run the list action repeatedly: pass the `cursor` returned from each response into the next run until no further cursor is returned (or use a code step to loop). Sensitive credentials are handled via the app connection (OAuth); do not put tokens in action props.

## Pipedream component conventions

Shared props (`filter`, `sort`, `cursor`, `record`, and resource-specific UUID selectors) and HTTP helpers are defined on the ServiceM8 app file with JSDoc. UUID fields use **async options** where possible so you can pick a record from a list or type a UUID. Optional props are used for filters and pagination; set defaults in your workflow where needed.

## Testing (contributors)

[Pipedream does not currently support unit tests](https://pipedream.com/docs/components/contributing/guidelines#testing) to prove that app-file changes stay backwards compatible with existing actions and sources. **If you change `servicem8.app.mjs` or files under `common/`, manually test impacted components** in a workflow (or the Pipedream UI) so behaviour is unchanged.

Suggested checks:

- **Sources** that call app methods or webhooks (`new-job`, `new-client`, `job-completed`, `job-queued`, `new-form-response`): create or update the source, confirm activation/deactivation and that events emit as expected.
- **Actions** covering main API patterns: at least one **list** action with optional filter/cursor, one **get** by UUID, one **create** / **update** / **delete** if you touched CRUD helpers, and **webhook** / **SMS** / **email** actions if you changed those code paths.

Also run `npx eslint components/servicem8` from the monorepo root before opening a PR.
