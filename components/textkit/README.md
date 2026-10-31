# Overview

[TextKit](https://jointextkit.com) is an SMS API: send texts, receive replies, and send one-time verification codes. With these components you can text from any workflow, run phone verification, and start a workflow when one of your TextKit numbers receives a text.

# Getting Started

1. Create an API key in the [TextKit console](https://jointextkit.com/console) on the API Keys page. Keys start with `tk_sk_`.
2. Connect your TextKit account in Pipedream and paste the key.

A test key (`tk_sk_test_...`) runs in the sandbox: nothing reaches a real phone and nothing is billed. Sending to `+15005550006` always ends `delivered`, and the sandbox verification code is `111111`.

# Example Use Cases

- Text a customer when an order ships or an appointment is booked.
- Add SMS verification to a sign-up form with **Start Verification** and **Check Verification**.
- Forward inbound texts to Slack or a CRM with the **New Inbound Message** source.
