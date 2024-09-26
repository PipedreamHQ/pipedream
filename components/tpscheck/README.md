# Overview

The TPSCheck API provides access to the UK's Telephone Preference Service (TPS) and Corporate Telephone Preference Service (CTPS) databases, enabling businesses to check if a telephone number is registered. This helps in compliance with regulations by avoiding unwanted sales calls to these numbers. In Pipedream, you can use this API to automate the process of verifying numbers directly within your workflows, combining it with various triggers, actions from other apps, and custom logic for streamlined operations.

# Example Use Cases

- **Compliance Verification Before Calls**: Automate the process of checking phone numbers against the TPS/CTPS lists before initiating sales calls. If a number is registered, you can automatically reroute it to an exclusion list or log it for review.

- **CRM Integration for Contact Updates**: Cross-reference your CRM contacts with the TPSCheck API. If a contact is on the TPS/CTPS list, update their record in your CRM tool, like HubSpot, to ensure no sales calls are made to that contact.

- **Batch Processing of Marketing Lists**: Schedule a daily or weekly job that takes a list of phone numbers from a Google Sheet, checks each number with TPSCheck, and appends the verification results back to the sheet for a clean, compliant call list.
