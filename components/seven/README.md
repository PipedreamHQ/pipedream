# Seven (seven.io)

The Seven API on Pipedream allows you to send SMS messages, make voice calls (TTS), retrieve account analytics, and react to incoming SMS and voice events. seven.io provides SMS, RCS, WhatsApp, and Voice communication APIs.

## Links

- [seven.io Documentation](https://docs.seven.io/)
- [API Authentication](https://docs.seven.io/en/rest-api/authentication)
- [Pipedream Seven App](https://pipedream.com/apps/seven)

## Authentication

Connect your seven.io account using your **API Key**. You can create and manage API keys in the [seven.io Developer area](https://app.seven.io/developer).

## Actions

- **Send SMS** - Send an SMS to one or more recipients
- **Send Voice Call** - Create a TTS (Text-to-Speech) voice call
- **Get Analytics** - Retrieve account statistics (SMS, RCS, voice, HLR, usage)

## Event Sources

- **New Incoming SMS (Instant)** - Emit when a new inbound SMS is received
- **New Incoming Call (Instant)** - Emit when a voice call event occurs

## Example Use Cases

- **SMS Notifications**: Send SMS alerts when important events occur (e.g., server downtime, order confirmations)
- **Voice Reminders**: Trigger TTS voice calls for appointment reminders or verification codes
- **Inbound SMS Processing**: Process incoming SMS messages (e.g., customer support, two-way SMS campaigns)
- **Analytics Reporting**: Pull account usage and statistics into dashboards or reports
