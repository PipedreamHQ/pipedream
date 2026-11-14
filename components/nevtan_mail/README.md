# NevTan Mail

NevTan Mail is business email hosting with custom domains, calendar, scheduling and tasks in one
workspace. Its public API lets Pipedream read mail, send and reply on a mailbox's behalf, manage
mailboxes across a workspace, and subscribe to mail events over webhooks.

## Authentication

Two fields on the connected account:

| Field | Required | Notes |
| --- | --- | --- |
| `api_key` | Yes | Created in NevTan Mail under **Settings → Integrations → API keys**. Shown once, at creation. Sent as `Authorization: Bearer <key>` |
| `base_url` | No | Defaults to the production host. Set it to point a workflow at a staging environment |

A key inherits the role of the user who created it. Anything marked **admin** below needs a key
belonging to a workspace admin.

Requests are limited to 120 per minute per key; over that the API answers `429` with
`Retry-After: 60`.

## Sources

Each source registers a webhook subscription through `POST /api/v1/hooks` when it is enabled and
deletes it when disabled, so nothing is left behind when a workflow is turned off.

| Source | Event | Notes |
| --- | --- | --- |
| New Email Received | `email.received` | For the mailbox the API key belongs to |
| New Email Sent | `email.sent` | For the mailbox the API key belongs to |
| New Mailbox Created | `mailbox.created` | Workspace-wide; **admin** key required |

Deliveries retry with exponential backoff for up to twelve attempts, so the same event can arrive
more than once. All three sources set `dedupe: "unique"` keyed on the event name and resource id,
which makes delivery effectively once-per-event for downstream steps.

### Signature verification

NevTan Mail signs every delivery with `X-NevTan-Signature: sha256=<hex>`, an HMAC-SHA256 of
`<timestamp>.<raw body>` keyed with the subscription's secret, alongside `X-NevTan-Timestamp`,
`X-NevTan-Event` and `X-NevTan-Delivery`.

**The API does not return that secret**, so verification is opt-in: supply it in the source's
optional **Webhook Signing Secret** prop and each delivery is verified with a constant-time
comparison, rejecting anything unsigned, altered, or signed more than five minutes ago. Left
blank, verification is skipped and the Pipedream trigger URL is the only thing protecting the
source — treat that URL as a credential.

## Actions

| Action | Endpoint | Notes |
| --- | --- | --- |
| Send Email | `POST /emails/send` | |
| Reply to Email | `POST /emails/{id}/reply` | Sends immediately; supports reply-all |
| Create Draft | `POST /drafts` | Saves without sending. Not threaded — see below |
| List Emails | `GET /emails` | `inbox` or `sent`, newest first |
| Find Emails | `GET /emails/search` | Matches sender, subject and body |
| Get Email | `GET /emails/{id}` | Returns the full body |
| Create Mailbox | `POST /mailboxes` | **admin** key required |

## Behaviour worth knowing

**Rejected requests can arrive as HTTP 200.** NevTan Mail rewrites `400` responses to `200` for
every path outside its billing endpoints, so a validation failure looks like a success at the
status-code level and carries an error body instead. Every method in this app inspects the
response body and raises a `ConfigurationError` when it finds one, rather than trusting the
status.

**Drafts are not threaded.** The underlying service supports replying in-thread, but the public
API accepts no original-message id, so a draft created through `POST /drafts` is a standalone
message with a null `thread_id`. Quote the original in the body if the reviewer needs context.

**`email.sent` does not mean delivered.** It fires once the delivery attempt concludes, whether
the result was delivered or bounced, and no payload field exposes the outcome. Bounces instead
arrive as `email.received` events from the mail delivery subsystem, with a
`Delivery Status Notification (Failure):` subject prefix.

**Spam and filtered mail never fire `email.received`.** Inbound filters run first, and messages
marked as spam or deleted by a filter are suppressed before the event is raised.

**Attachments cannot be fetched.** Payloads report `has_attachments` and `attachment_count`; there
is no public endpoint to download the file itself.

**List endpoints return at most 50 results** with no offset or date filter, so scheduled polling
sees a rolling window rather than history. Message bodies are capped at 100,000 characters.
