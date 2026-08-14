# Overview

The EZ Texting API sends SMS and MMS messages, manages contacts and contact groups, and pushes inbound replies to a webhook. With Pipedream you can send a text off the back of any trigger, act on replies as they arrive, and keep opt-out state in sync with the rest of your stack.

# Example Use Cases

- **Send an SMS Survey and Collect Replies**: Send a survey invite with **Send Text Message**, then use the **New Inbound Message (Instant)** trigger to capture each reply and write it to Google Sheets, a database, or an analytics tool.

- **Honor Opt-Outs Automatically**: When an inbound message arrives with `optOut: true`, run **Block Numbers** to suppress future sends and record the opt-out in your own system — EZ Texting emits no dedicated opt-out event, so this is the signal to act on.

- **Keep Contacts in Sync With Your CRM**: When a contact is created or updated in HubSpot or Salesforce, use **Create or Update Contact** to mirror it into EZ Texting, and **Get Contact** before a send to check the authoritative `optOut` flag.

# Getting Started

EZ Texting authenticates with HTTP Basic, using your account's app key as the username and app secret as the password (your EZ Texting email and password also work).

The **New Inbound Message (Instant)** trigger registers its own webhook subscription and generates the shared secret used to sign callbacks, so there is nothing to configure by hand — replies start arriving once the source is deployed.
