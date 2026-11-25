# Paymos Pipedream Components (`@pipedream/paymos`)

Official Pipedream components for [Paymos](https://paymos.io) — accept stablecoin (**USDT, USDC, USD1, DAI**) and gold-backed **XAUT** payments across **13 deposit networks**, price invoices in **45 fiat currencies** or crypto, manage per-customer Payment Channels and server-calculated invoice refunds, and trigger workflows on verified Paymos webhooks.

Built as pure Node.js ESM (`.mjs`) with **zero external runtime dependencies** (`node:crypto` + native `fetch`).

## Authentication (`this.$auth`)

Connect your Paymos account in Pipedream using a **Payment API** key pair from **Paymos Dashboard -> Developer -> API Keys**:

| Field | Required | Description |
| --- | --- | --- |
| `public_key` | Yes | Payment API key starting with `pk_live_` (Production) or `pk_test_` (Sandbox). Payout keys (`rk_`) are rejected before any network call. |
| `secret_key` | Yes | Full Payment API secret (`sk_...`) used to compute canonical HMAC-SHA256 request signatures. |
| `base_url` | No | Paymos Merchant API base URL. Defaults to `https://api.paymos.io`. Must use HTTPS (HTTP is permitted only for loopback testing). |

All outgoing requests are signed with:
- `Authorization: HMAC-SHA256 {public_key}:{base64(hmac_sha256(secret_key, canonical))}`
- `X-Request-Timestamp: {unixSeconds}`
- Canonical string: `{timestamp}\n{METHOD}\n{path}\n{queryWithOptionalLeadingQuestionMark}\n{bodyHash}` (empty string for body-less requests, never `sha256("")`).

## Actions (8)

| Key | Name | Endpoint | Notes |
| --- | --- | --- | --- |
| `paymos-create-invoice` | Create Invoice | `POST /v1/invoices` | Decimal string `amount`, 45 fiat currencies or crypto assets, idempotent `external_order_id` (cannot start with `wgt_`), optional `network`, `customer_fee_percent` (0–100), `client_id`. |
| `paymos-get-invoice` | Get Invoice | `GET /v1/invoices/{invoice_id}` | Retrieves invoice details by prefixed `inv_...` ID. |
| `paymos-list-invoices` | List Invoices | `GET /v1/invoices` | Filters by `project_id`, `status[]`, `external_order_id`, `created_from`, `created_to`, `limit` (1–100), and `cursor`. |
| `paymos-cancel-invoice` | Cancel Invoice | `POST /v1/invoices/{invoice_id}/cancel` | Requires a non-empty `reason` (1–500 characters). |
| `paymos-simulate-sandbox-invoice` | Simulate Sandbox Invoice | `POST /v1/sandbox/invoices/{invoice_id}/simulate-payment` | Drives a sandbox invoice to `paid`, `overpaid`, `underpay`, or `cancel`. Strictly requires `pk_test_` and rejects `pk_live_` before network. |
| `paymos-create-payment-channel` | Create Payment Channel | `POST /v1/payment-channels` | Idempotently creates or retrieves a permanent multi-network deposit channel (`project_id`, `external_id`). |
| `paymos-get-payment-channel` | Get Payment Channel | `GET /v1/payment-channels/{channel_id}` | Retrieves a payment channel with provisioned addresses and per-token minimums. |
| `paymos-create-refund` | Create Refund | `POST /v1/refunds` | Strict DTO `{ invoice_id, mode, external_order_id }` (`full` or `overpayment`); Paymos calculates amount, asset, network, and recipient server-side. |

## Sources (1)

### `paymos-new-webhook-event` — New Webhook Event (Instant)

Paymos does not expose a Webhook Management REST API, so webhook endpoints are registered manually in the dashboard:

1. Deploy the **New Webhook Event (Instant)** source in Pipedream and copy its generated HTTP endpoint URL.
2. Open **Paymos Dashboard -> Developer -> Webhooks**, add that HTTPS URL, and select the desired categories.
3. Paste the generated `whsec_...` signing secret into the source's **Webhook Signing Secret** (`webhookSecret`) prop.
4. Optionally narrow the **Events** prop to specific canonical Paymos events (leave empty to emit all 18).

Security & delivery guarantees:
- Verifies `X-Webhook-Signature: t={ts},v1={hex}` against `event.bodyRaw` using `node:crypto.timingSafeEqual`, supporting dual `v1=` signatures during secret rotation and a 300-second replay tolerance window.
- Fails closed with HTTP `401` (`application/problem+json`, `code: "webhook_signature_invalid"`) without emitting if `bodyRaw` is missing, the signature is invalid, the timestamp exceeds 300 seconds, or `webhookSecret` is invalid.
- Persists up to 500 recent verified `event_id` values in `$.service.db` (`seenEventIds`, FIFO eviction) and acknowledges duplicates with HTTP `200` without re-emitting.
- Supports all **18 canonical Paymos webhook events**:
  - **Invoice (9):** `invoice.awaiting_payment`, `invoice.confirming`, `invoice.underpaid_waiting`, `invoice.paid`, `invoice.paid_over`, `invoice.underpaid`, `invoice.expired`, `invoice.cancelled`, `invoice.paid_late`
  - **Payment Channel Deposit (3):** `payment_channel.deposit.confirming`, `payment_channel.deposit.reorged`, `payment_channel.deposit.confirmed`
  - **Withdrawal (6):** `withdrawal.created`, `withdrawal.processing`, `withdrawal.completed`, `withdrawal.failed`, `withdrawal.cancelled`, `withdrawal.completion_rewound`

## Error Handling (RFC 9457)

Non-2xx responses throw `PaymosApiError`, preserving the HTTP `status`, top-level `code`, `field`, `detail`, and `errors[]` array without overwriting top-level `code` with `errors[0].code`.

## Conformance Tests

Run the zero-dependency Node.js conformance suite against `plugins/sdk-conformance/contract.json`:

```bash
node --test tests/conformance.test.mjs
```

## Documentation & Support

- [Paymos Merchant API Docs](https://paymos.io/docs)
- [Paymos Webhooks Reference](https://paymos.io/docs/webhooks)
- Support: `support@paymos.io`
