# Wafly

Send a text message using a connected Wafly instance. Wafly provides a managed,
unofficial WhatsApp API. API acceptance is separate from WhatsApp delivery or read
status. This component does not create or reconnect an instance.

## Connected account

Managed authentication registration is requested in
[PipedreamHQ/pipedream#21549](https://github.com/PipedreamHQ/pipedream/issues/21549).
The component expects three separate connected-account fields:

| Field | Meaning | Secret |
| --- | --- | --- |
| `client_token` | Account token sent in the `Client-Token` header | Yes |
| `instance_id` | Public identifier of the existing instance | No |
| `instance_token` | Instance token used in the API route | Yes |

Use an existing instance that you own. The account validation request should be
`GET /api-bridge-whats/instances/{instance_id}/token/{instance_token}/webhook`,
with the account header. This reads saved configuration and validates the
instance ID and instance token without starting a WhatsApp session. It requires
a nonempty account header but does not verify that header's value. Do not treat
this result as full validation of all three fields. The account token must be
copied from the owning Wafly account; do not send a message just to test it.
Do not use a QR, connect, reset, logout, or native status operation for background
authentication checks.

Never put tokens in workflow output, examples, or public issues. Error messages
from this component omit request URLs, credentials, and provider response bodies.

## Send Text Message

Enter the recipient in international format and the message text. Existing Wafly
group identifiers such as `120363000000000-group` and newsletter identifiers
such as `120363000000000@newsletter` are also accepted. The request is submitted
once, with a thirty-second timeout and no automatic retry.

A nonempty `messageId` confirms API acceptance. A missing identifier or an
uncertain network result must be checked before sending again. An identifier
starting with `DUPLICATE_` indicates duplicate prevention, not a new submission.
It does not confirm delivery of the original operation.

[API documentation](https://wafly.com.br/api-docs)

[Create a Wafly account](https://wafly.com.br/signup?utm_source=pipedream&utm_medium=integration&utm_campaign=wafly_pipedream_20261116&utm_content=readme_signup)

## Development validation

Run `node --test components/wafly/common/connector.test.mjs` from the repository
root. The tests mock every Wafly network request and use fake credentials. No
live message, customer account, or connected session is used. Platform-managed
authentication and a live sandbox run remain separate review requirements.
