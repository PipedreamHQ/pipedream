# Overview

The Mailtrap API provides an end-to-end email platform covering both Transactional Email Sending and Email Testing/Sandbox. Within Pipedream, you can trigger workflows to reliably send transactional emails, attach generated files, track delivery logs/states in real-time, audit your verified sending domains, and manage suppressed recipients to keep your sender reputation healthy.

# Example Use Cases

- **Transactional Notifications**: Trigger transactional receipt, welcome, or alert emails with HTML/text templates dynamically populated by webhook events.
- **Automated Report Delivery**: Generate PDF/CSV reports in Pipedream workflows, save them to `/tmp`, and send them as email attachments via Mailtrap.
- **Delivery Monitoring**: Query Mailtrap's Email Logs API by `sending_message_id` to inspect delivery statuses, bounce reasons, and tracking events.
- **Sending Domain Audits**: List your verified sending domains and their DNS/compliance status to catch misconfigured domains before they cause delivery failures.
- **Suppression List Management**: List addresses suppressed due to hard bounces, spam complaints, or unsubscribes, manually suppress addresses you want to block, and remove entries once the underlying issue is resolved to resume sending to them.