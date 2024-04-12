# Overview

The Email API on Pipedream enables you to send emails directly within your workflows. You can generate and dispatch emails in response to a wide range of triggers, such as HTTP requests, schedule timers, or events from other apps. With rich customization options, you can format the emails with HTML, attach files, and specify recipients dynamically. This opens a realm of possibilities for automated notifications, alerts, and even data distribution through emails.

# Example Use Cases

- **Automated Error Notifications**: This workflow listens for error logs from a monitoring service like Sentry. When an error is detected, it triggers the workflow, which formats a detailed report and sends an email to the development team, ensuring prompt attention to critical issues.

- **Email Digests of Data Changes**: Keep track of changes in a Google Sheet or database. When updates are detected, the workflow compiles the changes into a digest and sends a scheduled summary email to stakeholders, keeping everyone informed about the latest modifications.

- **Customer Feedback Collection**: Following a customer interaction with a support ticketing system like Zendesk, an automated email is generated to request feedback. The workflow sends a personalized email to the customer and collects their responses for analysis and service improvement.
