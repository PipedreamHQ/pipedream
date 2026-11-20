# Overview

NevTan Sign is an e-signature platform for sending documents and templates out for signature. With the NevTan Sign API on Pipedream you can react when envelopes are created, sent, completed, declined or voided, and create or void envelopes from any workflow.

# Example Use Cases

- **Archive completed agreements**: when an envelope is completed, record it in your CRM or a spreadsheet and notify the account owner in Slack.
- **Send contracts from your CRM**: when a deal reaches a given stage, create an envelope from a template with the customer's email mapped to the template's signer role.
- **Follow up on declined envelopes**: when a signer declines, open a ticket with the reason they gave.

# Getting Started

1. In NevTan Sign, generate an API key for your account. API access must be included in your plan.
2. In Pipedream, connect a NevTan Sign account and paste the key into the **API Key** field.
3. Optionally set **Workspace ID** on a trigger or action to act on a team workspace. If left blank, the personal workspace of the API key's owner is used.

# Troubleshooting

- **401 / Invalid Credentials**: the API key is wrong or has been regenerated.
- **403**: the account's plan does not include API access, or the account is not a member of the workspace given in **Workspace ID**.
- **"failure" responses**: NevTan Sign returns HTTP 200 with `status: "failure"` for business-rule errors (for example, voiding a draft). These components surface the API's message as the error.
- **Triggers use polling**: NevTan Sign allows one webhook URL per workspace, so these triggers poll the envelope list instead of registering a webhook and never change your webhook settings. Events arrive on the trigger's timer interval rather than instantly.
