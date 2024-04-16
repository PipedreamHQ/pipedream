# Overview

The Bandwidth API opens up a world of possibilities for integrating telecom services into your applications. Bandwidth specializes in voice, messaging, and 911 access, making it possible to programmatically send and receive text messages, orchestrate calls, and implement emergency call routing. Linking the Bandwidth API with Pipedream allows you to automate these telecom features with various triggers and actions from other apps, creating seamless and powerful workflows.

# Example Use Cases

- **Automated Customer Support System**: Build a system that automatically responds to customer support queries via SMS. When an SMS is received, it triggers a workflow that classifies the query using a machine learning model. Based on the classification, it either responds with a predefined message or escalates the issue to a human agent by creating a ticket in a service like Zendesk.

- **Real-time Alerts and Notifications**: Set up a workflow where Bandwidth sends out voice or SMS alerts based on triggers from monitoring tools like Datadog. For instance, if a monitoring tool detects server downtime, a high priority alert is sent to the on-call engineer via Bandwidth, ensuring quick response times to critical incidents.

- **Event-Driven Survey Campaigns**: After a customer interaction with your service, use a workflow to send a follow-up survey via SMS. When a customer completes a transaction or interaction, Pipedream triggers Bandwidth to send an SMS with a link to a feedback form. The responses can then be collected and stored in a database like Airtable for analysis and follow-up.
