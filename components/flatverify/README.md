# Overview

Flatverify checks email addresses on a flat monthly price. Every plan is unlimited; plans differ only in speed. Each address comes back `valid`, `invalid`, `risky` or `unknown`, with a one-word reason such as `catch_all`, `role_account`, `disposable` or `mailbox_not_found`. With Pipedream you can check a single address the moment it arrives, or send a whole list as one job and pass on only the rows that can receive mail.

# Example Use Cases

- **Verify new leads before the sequence**: When a new HubSpot contact or form fill arrives, run **Verify Email**. Valid addresses go straight into your sequence, risky ones get a tag for a softer touch, and invalid ones never get a single email.

- **Clean a Google Sheet every night**: On a schedule, read the rows added that day, send them to **Verify List**, and write `status` and `sub_status` back into two columns. Every plan is unlimited, so re-running the whole sheet costs nothing extra.

- **Gate your Clay or Apollo export**: Send the exported rows as one list with **Verify List**, wait for the job, and pass on only rows where `status` is `valid`. Risky rows can go to a separate tab for review.

- **Stop fake signups at the door**: When a signup webhook fires, run **Verify Email** and flag disposable addresses and addresses that cannot receive mail before the welcome mail goes out.

# Getting Started

Create an API key in Flatverify under **API keys** at https://app.flatverify.com/api-keys (new accounts get 100 free checks, no card needed), then connect your Flatverify account in Pipedream and paste the key.

# Troubleshooting

- A `401` means the API key is wrong or was revoked. Create a new key and reconnect.
- A `429` with `rate_limited` means your plan speed is reached for this minute; the components wait for the `Retry-After` time and retry up to three times. A `429` with `too_many_jobs` means five lists are already running.
- Large lists can take longer than a workflow step allows. Set **Wait Seconds** in **Verify List** to `0`, then use **Get Job** and **Get Job Results** in a later step or workflow.

Full API reference: https://flatverify.com/docs
