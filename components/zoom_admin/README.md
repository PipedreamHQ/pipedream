# Overview

The Zoom Admin API lets you harness the extensive capabilities of Zoom for automation and integration, right within Pipedream. Automate user management, track Zoom rooms, monitor webinars and meetings, and customize your workflow to respond dynamically to events like new participants or ended meetings. With these APIs and the power of Pipedream, you can streamline administrative tasks, extract valuable insights, and sync Zoom activities with other services.

# Example Use Cases

- **Automated User Provisioning and Deprovisioning**: Sync user data from your HR platform (e.g., BambooHR) with Zoom. When a new employee is added in BambooHR, automatically create a Zoom user account for them. Conversely, when an employee leaves, trigger a workflow to deactivate their Zoom account.

- **Meeting Analytics and Reporting**: Connect Zoom Admin with a data visualization tool like Tableau. Each time a meeting ends, aggregate meeting statistics and send them to Tableau to create real-time dashboards that help management analyze usage patterns and meeting effectiveness.

- **Webinar Attendee Follow-Up**: Link Zoom webinars with email platforms such as SendGrid. After a webinar ends, send a customized follow-up email to all attendees with a survey or additional resources, and update your CRM (like Salesforce) with attendee engagement data.

# Getting Started
## Zoom vs Zoom Admin app

Zoom users can be classified into two groups: non-admins and admins. Admins have account-level permissions that users do not, and Zoom has corresponding admin-level scopes that aren't relevant for normal users. Therefore, Pipedream exposes two apps — **Zoom** and **Zoom Admin** — to serve the two groups.

In the Zoom Marketplace, these apps are named [Pipedream](https://marketplace.zoom.us/apps/jGaV-kRrT3igAYnn-J5v2g), and [Pipedream for Zoom Admins](https://marketplace.zoom.us/apps/tZvUsiucR96SqtvfBsemXg), respectively.

Non-admins have [permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions#user-managed-scopes) to manage standard Zoom resources in their account: meetings, webinars, recordings, and more. **If you're a non-admin, you'll want to use the Zoom app**.

Zoom admins have [permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions#account-level-scopes) to manage account-level resources, like users and reports. They can also manage webinars and meetings across their organization. **If you're an admin and need to manage these resources via API, you'll want to use the Zoom Admin app**.

The [Zoom API docs on permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions) provide detailed information on these permissions and their associated OAuth scopes.

## Zoom Admin

This directory contains [event sources](https://docs.pipedream.com/event-sources/) that operate on data from the [Zoom API](https://marketplace.zoom.us/docs/api-reference/introduction). **These event sources work with the Zoom Admin app in Pipedream**, specifically meant for Zoom admins operating on data across their account.

Event sources let you turn any API into an event stream. For example, the [`recording-completed.js`](recording-completed.js) event source polls the Zoom API for new meeting or webinar recordings tied to your user, and [emits](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#emit) a new event for every new recording it finds. You can access these events in real-time using a [private SSE stream](https://docs.pipedream.com/api/sse/) tied to your source, or in batch using the [REST API](https://docs.pipedream.com/api/rest/). Or you can trigger [Pipedream workflows](#pipedream-workflows) on every new event.

### Pipedream workflows

You can trigger a [Pipedream workflow](https://docs.pipedream.com/workflows/) — hosted Node.js code — on every new event from any Zoom source. You can find a few example workflows below.

To use a workflow, just **Copy** it and follow the instructions in the workflow's `README`. You can modify or extend these workflows in any way you'd like.

- [Save Zoom recordings to Amazon S3, then delete Zoom recording](https://pipedream.com/@dylburger/save-zoom-recordings-to-amazon-s3-p_PACKJG/readme)

For a deeper introduction to Pipedream and event sources, see the [root `README` in this repo](/README.md), the [component API](/COMPONENT-API.md), or the [docs](https://docs.pipedream.com/apps/zoom/).
