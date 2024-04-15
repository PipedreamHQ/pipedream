# Overview

The Thinkific API empowers you to tap into the robust functionalities of the Thinkific platform, allowing for the automation and integration of your online course delivery and student engagement processes. With this API, you can create, update, and manage courses, users, enrollments, and more. It's perfect for enhancing your e-learning experience and streamlining your educational operations. On Pipedream, you can hook into this API to set up workflows that react to events in Thinkific or automate tasks, all without the need for a server setup.

# Example Use Cases

- **Automate Course Enrollment**: When a user purchases a course on your website, automatically enroll them in the corresponding Thinkific course. This can be achieved by triggering a Pipedream workflow with a webhook upon purchase completion and using the Thinkific API to create the enrollment.

- **Sync User Progress With CRM**: Update a user's progress in your CRM whenever they complete a module or course in Thinkific. Pipedream can watch for completion events using Thinkific webhooks and then make API calls to update the user's record in your CRM, like Salesforce or HubSpot.

- **Distribute Custom Certificates**: Generate and send personalized certificates by email to students when they finish a course. This workflow can leverage Thinkific's completion webhooks to trigger a Lambda function in Pipedream, which then uses a service like Canva or DocuSign to create the certificate and an email service like SendGrid to send it out.
