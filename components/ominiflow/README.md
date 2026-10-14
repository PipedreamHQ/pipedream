# Ominiflow Pipedream Components

Integrate **Ominiflow** with thousands of applications using Pipedream. Ominiflow provides WhatsApp Business messaging, CRM contact management, broadcast campaigns, and automated flows.

---

## Authentication

To authenticate with Ominiflow:

1. Log into your [Ominiflow Dashboard](https://whatsapp.ominiflow.com).
2. Go to **Settings** > **API / Developer Keys**.
3. Generate a new API token.
4. Copy the API Token and paste it into Pipedream when connecting your account.

*(Optional)* If you host a private or custom domain instance of Ominiflow, enter your custom URL (e.g. `https://your-domain.com`).

---

## Actions

### 1. Send WhatsApp Text Message (`ominiflow-send-text-message`)
Send a direct text message to any customer WhatsApp phone number.
* **Recipient Phone Number:** Phone number with country code (e.g. `+919876543210`).
* **Message Text:** Body content to send.
* [See the documentation](https://ominiflow.com/docs)

### 2. Send WhatsApp Template Message (`ominiflow-send-template-message`)
Send an approved Meta WhatsApp template to a contact with dynamic parameters.
* **Recipient Phone Number:** Customer WhatsApp phone number.
* **Template Name:** Select from your approved templates.
* **Language:** Template language code (e.g., `en`, `hi`).
* **Body Variables:** Ordered list of values replacing `{{1}}`, `{{2}}`, etc.
* [See the documentation](https://ominiflow.com/docs)

### 3. Create or Update Contact (`ominiflow-create-or-update-contact`)
Save customer leads or sync contact information into Ominiflow CRM.
* **Phone Number:** Customer phone number.
* **Full Name:** Customer name.
* **Email:** Customer email.
* **Group:** Group/category in Ominiflow.
* [See the documentation](https://ominiflow.com/docs)

---

## Triggers

### 1. New Incoming WhatsApp Message (`ominiflow-new-incoming-message`)
Emits an event instantly whenever a customer sends or replies to a message in Ominiflow.
* Use this to trigger automated customer support flows, CRM updates, AI agent conversations, or notifications in Slack/Email.
* To connect this trigger, copy its generated Pipedream HTTP endpoint into Ominiflow's webhook settings and subscribe it to the `messages` event. See the [Ominiflow webhook guide](https://ominiflow.com/tutorials/webhook-integration).
* [See the documentation](https://ominiflow.com/docs)

### 2. Message Status Updated (`ominiflow-message-status-updated`)
Emits an event when outbound WhatsApp delivery status changes (`sent`, `delivered`, `read`, `failed`).
* To connect this trigger, copy its generated Pipedream HTTP endpoint into Ominiflow's webhook settings and subscribe it to the `message_status` event. See the [Ominiflow webhook guide](https://ominiflow.com/tutorials/webhook-integration).
* [See the documentation](https://ominiflow.com/docs)

---

## Popular Workflow Examples

* **Shopify / WooCommerce ➔ Ominiflow:** Send automatic WhatsApp order confirmations and tracking updates.
* **Google Sheets ➔ Ominiflow:** Send personalized WhatsApp messages when new rows are added.
* **Ominiflow ➔ HubSpot / Salesforce:** Log customer WhatsApp replies into CRM contact timelines.
* **Ominiflow ➔ OpenAI / Claude:** Automatically generate intelligent responses to customer queries.
