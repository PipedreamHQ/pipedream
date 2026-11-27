# Overview

The ProWebLook API provides real-time email verification, phone number validation with carrier and line-type intelligence, and silent WhatsApp registration checks. When integrated with Pipedream, you can verify inbound leads before syncing them to your CRM, route contacts to WhatsApp or SMS channels based on live registration status, and monitor remaining API credit balances across automated workflows.

# Example Use Cases

- **Real-Time Signup and Lead Qualification**: Trigger a workflow from a webhook, form submission, or CRM event, verify the lead's email address with **Verify Email**, validate their phone number with **Validate Phone**, and sync only verified contacts to HubSpot, Salesforce, or Airtable.

- **Omnichannel Outreach Routing**: Use **Check WhatsApp** to silently determine whether an international phone number is active on WhatsApp without sending an OTP or message, routing registered numbers to WhatsApp Business workflows and non-registered numbers to email or SMS sequences.

- **Automated Credit Balance Monitoring**: Schedule a daily workflow using **Get Balance** to inspect your remaining email, phone, and WhatsApp credit pools and send a Slack or email alert when any credit pool drops below your threshold.
