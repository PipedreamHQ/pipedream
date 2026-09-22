# Overview

[VirtualSMS](https://virtualsms.io) is an SMS-verification provider backed by **real, physical SIM cards** in Europe. The API gives you on-demand virtual phone numbers across 145+ countries to receive SMS verification codes for 700+ services (WhatsApp, Telegram, Google, Facebook, Tinder, Instagram, exchanges, marketplaces, dating apps, and more). Numbers are non-VoIP, you pay only when an SMS arrives, and rentals can be cancelled for a refund if no message is received.

With Pipedream you can wire VirtualSMS into any of 3,000+ apps to automate verification flows that previously required a human to copy a code by hand.

# Example Use Cases

- **Headless account creation pipeline.** A workflow rents a number for the target service, posts the number to your signup automation, and the **New SMS Received** trigger forwards the verification code back the moment it arrives — no polling code on your side.
- **Multi-region testing.** Rent UK / Poland / Germany / Czech numbers in parallel from a Pipedream loop, capture the SMS each provider delivers, and write the latency + success matrix to Google Sheets or a database.
- **Low-balance Slack alerts.** Run **Get Balance** on a daily schedule and post to Slack when balance falls below your reorder threshold so a verification campaign never stalls mid-batch.
- **Refund unused rentals.** When a downstream signup flow detects an account creation failure, branch into **Cancel Rental** to release the number and refund the unused balance automatically.

# Getting Started

1. Sign in at [virtualsms.io](https://virtualsms.io) and open **Settings → API Keys**.
2. Create a key (we recommend naming it `Pipedream` for easy identification) and copy it.
3. In Pipedream, when prompted by any VirtualSMS action or trigger, paste the key into the **API Key** field of the connected account dialog.
4. Top up your balance from the dashboard before renting numbers — the **Rent Number** action will return a `402` if you're under the per-rental price.

# Troubleshooting

VirtualSMS uses standard HTTP status codes:

- **401 Unauthorized** — your API key is missing, mistyped, or revoked. Re-create the key in the dashboard and reconnect the account.
- **402 Payment Required** — insufficient balance. Top up at [virtualsms.io](https://virtualsms.io) and retry.
- **404 Not Found** — the order ID does not belong to your account, or the requested service / country combination is currently out of stock.
- **429 Too Many Requests** — you've exceeded the per-key rate limit (60 req/min). Throttle the workflow or use Pipedream's [concurrency controls](https://pipedream.com/docs/workflows/concurrency-and-throttling).
- **5xx** — VirtualSMS server-side issue; retry with backoff. Pipedream surfaces the upstream status code so you can branch on it.
