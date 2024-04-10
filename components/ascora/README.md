# Overview

The Ascora API provides a gateway to interact with Ascora's business management software, which is tailored for trades and services companies. By leveraging this API within Pipedream, you can automate tasks such as job scheduling, invoicing, and customer management. Users can create powerful serverless workflows that trigger actions within Ascora in response to events from other apps, or schedule routine tasks that keep business operations running smoothly.

## Example Ascora Workflows on Pipedream

- **Invoice Generation and Email Delivery**: Combine Ascora with a mail service like SendGrid. When a job status updates to 'completed' in Ascora, trigger a Pipedream workflow to generate an invoice and use SendGrid to email it directly to the customer.

- **Job Scheduling with Google Calendar Integration**: Sync Ascora job bookings with a Google Calendar. Whenever a new booking is made in Ascora, a Pipedream workflow can create or update an event in Google Calendar, ensuring that technicians know their schedule in real-time and avoid double-bookings.

- **Customer Follow-up Automation**: After a service is completed, set up a workflow that waits a set number of days, then uses Twilio to send an SMS or make a phone call to the customer to request feedback or offer additional services.
