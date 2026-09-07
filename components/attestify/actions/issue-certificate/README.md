# Issue Certificate

Issue a tamper-evident, cryptographically-verifiable certificate with Attestify. Each certificate
gets a permanent public verify page anyone can check — Ed25519-signed, so it can't be forged after
issuance. Free, no signup.

**Props**
- **Organization / Issuer** (required) — shown on the certificate and the public verify page.
- **Course / Credential** (required) — what the certificate is for.
- **Recipient Name** (required) — name on the certificate.
- **Recipient Email** (optional) — echoed back so you can join it to the verify URL for a mail-merge
  or LMS step. Never stored in the signed record and never shown on the public verify page.
- **Completion Date** (optional, `YYYY-MM-DD`) — defaults to today.

**Returns** the issued certificate: `cert_id`, `verify_url` (the permanent public page),
`signed_record_url` (the Ed25519-signed JSON), `cert_image_url`, plus the echoed fields.

Docs: https://attestify.novadyne.ai
