# Overview

The sendSMS API provides a straightforward way to integrate SMS capabilities into automation workflows on Pipedream. This API allows you to send text messages directly to users' phones, which can be pivotal for timely alerts, critical notifications, or personalized marketing messages. With Pipedream's serverless platform, you can trigger these SMS communications based on a wide variety of events, such as new e-commerce orders, support ticket updates, or even changes in third-party APIs.

# Example Use Cases

- **Order Confirmation Texts**: When a customer completes a purchase on your e-commerce platform (like Shopify), a Pipedream workflow can be triggered, capturing the order details and using the sendSMS API to send a confirmation message to the customer's phone number.

- **Appointment Reminders**: Sync a calendaring app like Google Calendar with Pipedream. When an upcoming appointment is nearing, a workflow can automatically fetch the appointment details and use the sendSMS API to dispatch a reminder SMS to the participant.

- **Real-time Alerts from IoT Devices**: If you have IoT devices that monitor certain conditions (like a smart thermostat tracking temperature), you can connect these devices to Pipedream. Whenever the device detects a specified condition (e.g., temperature too high), it can trigger a Pipedream workflow that sends an alert via the sendSMS API to responsible personnel.
