# Overview

The [sms-florin](https://flo-voice1.com) API lets you rent real UK mobile numbers and receive SMS/OTP verification codes on them programmatically — handy for testing signup and verification flows without burning a personal number.

With these components you can:

- Rent a number for a specific service (WhatsApp, Telegram, Google, and more)
- Read a rental's status, phone number, and any codes received
- Trigger a workflow the moment a code lands on one of your numbers

# Example Use Cases

- **End-to-end signup test** – *Rent a Number* for the service under test, drive the signup in another step, then *Get Rental* to pull the verification code.
- **Route incoming codes** – use the *New SMS Received* trigger to forward every code to Slack, a database, or a test runner.
- **Scheduled account provisioning** – on a timer, rent a number, wait for the activation code, and hand both to a downstream system.

# Getting Started

1. Create an account at [flo-voice1.com](https://flo-voice1.com) and add balance.
2. Generate an API key on the [API access page](https://flo-voice1.com/api-access).
3. In Pipedream, add the sms-florin app and paste the key when prompted.

# Troubleshooting

- **`invalid or missing API key`** – the key is wrong or was revoked. Generate a new one on the API access page and update the connected account in Pipedream.
- **`Rent a Number` fails with an insufficient-balance error** – top up your account balance; each rental is charged up front.
- **`New SMS Received` emits nothing** – a code only appears after the target service actually sends one to the rented number, and the trigger only looks at your 25 most recent rentals.
