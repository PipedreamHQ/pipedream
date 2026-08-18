# Overview

The Mailtrap API provides an end-to-end email platform covering both Transactional Email Sending and Email Testing/Sandbox. Within Pipedream, you can trigger workflows to reliably send transactional emails, attach generated files, and track delivery logs/states in real-time.

# Example Use Cases

- **Transactional Notifications**: Trigger transactional receipt, welcome, or alert emails with HTML/text templates dynamically populated by webhook events.
- **Automated Report Delivery**: Generate PDF/CSV reports in Pipedream workflows, save them to `/tmp`, and send them as email attachments via Mailtrap.
- **Delivery Monitoring**: Query Mailtrap's Email Logs API by `sending_message_id` to inspect delivery statuses, bounce reasons, and tracking events.