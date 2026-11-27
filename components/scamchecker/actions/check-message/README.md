# Check Message

## Overview

Checks a suspicious message for signs of fraud and returns a verdict, a summary and the signals Scamchecker found.

Either provide the **Message Text** (the suspicious email, SMS or WhatsApp text, max 8,000 characters) or a **Message URL**. When a URL is set, Scamchecker checks the link itself instead of the message text.

The `verdict` field in the response is one of:

| Verdict | Meaning |
| --- | --- |
| `fake` | The message is almost certainly fraud. |
| `suspicious` | The message shows warning signs. |
| `no_red_flags` | No warning signs found (this is no guarantee the message is genuine). |
| `unclear` | The check could not determine this with confidence. |

The result also includes `summary` (why the verdict was reached), `signals` (the individual warning signs), `impersonates` (a brand or service the message may be impersonating), `advice` (recommended next steps) and `spans` (the exact quotes from the message that triggered the signals).

Each API key allows 20 checks per 10 minutes and 100 checks per day. Free API keys are available at [scamchecker.nl/api/sleutel](https://scamchecker.nl/api/sleutel/).

# Example Use Cases

1. Check messages forwarded to a shared inbox automatically and alert the team when the verdict is `fake` or `suspicious`.
2. Screen links from customer support tickets before employees open them.
3. Log every checked message in a spreadsheet to spot fraud campaigns early.

# Getting Started

1. Request a free API key at [scamchecker.nl/api/sleutel](https://scamchecker.nl/api/sleutel/). The key starts with `sc_` and is shown once.
2. Connect the Scamchecker app with that key.
3. Add the **Check Message** action and provide a message text or a link.

# Troubleshooting

## Authentication errors

An `Unauthorized` error means the API key is invalid or revoked. Request a new key at [scamchecker.nl/api/sleutel](https://scamchecker.nl/api/sleutel/).

## Rate limits

A `Too Many Requests` error means the key hit its limit of 20 checks per 10 minutes or 100 checks per day. The error response includes a `retry_after` value in seconds when applicable.
