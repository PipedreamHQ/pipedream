// A real `email.received` body, field for field as MailKite builds it
// (`buildWebhookPayload()` in the MailKite API; published contract:
// sdks/spec/schemas/email-received-event.json). Pipedream renders this as the event shape
// users build their workflows against, so it must not drift from the API.
//
// Two things the shape is easy to get wrong: `receivedAt` is when the message ARRIVED, not
// when the POST was made (so a retry or replay reports the same instant), and `name` rides
// along on an address only when the MIME header names that same address — it is omitted,
// never null, when unknown.
export default {
  id: "msg_2Hk9QpVn4tLd",
  type: "email.received",
  from: {
    address: "alice@example.com",
    name: "Alice Nguyen",
  },
  to: [
    {
      address: "support@yourdomain.com",
      name: "Support",
    },
  ],
  subject: "Re: my order",
  text: "Hey — any update on order #1234? Receipt attached.",
  html: "<p>Hey — any update on order #1234? Receipt attached.</p>",
  threadId: "thr_abc123",
  receivedAt: 1785249066000,
  receivedAtIso: "2026-07-28T14:31:06.000Z",
  auth: {
    spf: "pass",
    dkim: "pass",
    dmarc: "pass",
    spam: "ham",
  },
  // Each entry carries exactly one of `url` (a signed, credential-free GET link valid for
  // 7 days — the normal case) or `content` (base64 bytes, on zero-retention domains).
  attachments: [
    {
      id: "msg_2Hk9QpVn4tLd:0",
      filename: "receipt.pdf",
      contentType: "application/pdf",
      size: 48213,
      url: "https://api.mailkite.dev/att/2Hk9QpVn4tLd/0?exp=1785853866&sig=6f1c…",
    },
  ],
};
