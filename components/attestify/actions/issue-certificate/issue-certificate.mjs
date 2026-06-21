import app from "../../attestify.app.mjs";

export default {
  key: "attestify-issue-certificate",
  name: "Issue Certificate",
  description:
    "Issue a tamper-evident, cryptographically-verifiable certificate. Each certificate gets a permanent public verify page anyone can check — Ed25519-signed, so it can't be forged after issuance. Free, no signup. [See the documentation](https://attestify.novadyne.ai)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    issuer: { propDefinition: [app, "issuer"] },
    course: { propDefinition: [app, "course"] },
    recipientName: { propDefinition: [app, "recipientName"] },
    recipientEmail: { propDefinition: [app, "recipientEmail"] },
    completionDate: { propDefinition: [app, "completionDate"] },
  },
  async run({ $ }) {
    if (this.completionDate && !/^\d{4}-\d{2}-\d{2}$/.test(this.completionDate)) {
      throw new Error(
        `Completion Date must be in YYYY-MM-DD format (got "${this.completionDate}")`,
      );
    }

    const recipient = { name: this.recipientName };
    if (this.recipientEmail) recipient.email = this.recipientEmail;

    const body = {
      issuer: this.issuer,
      course: this.course,
      recipients: [recipient],
    };
    if (this.completionDate) body.date = this.completionDate;

    const resp = await this.app.issueCertificate($, body);

    if (!resp || resp.ok !== true) {
      const err = resp?.error ?? "unknown";
      const detail = resp?.detail ? ` — ${resp.detail}` : "";
      throw new Error(`Attestify error: ${err}${detail}`);
    }

    const cert = resp.certs && resp.certs[0];
    if (!cert) {
      throw new Error(
        "Attestify returned no certificate (the recipient may have been empty, or the request was treated as an automated crawler).",
      );
    }

    $.export(
      "$summary",
      `Issued certificate ${cert.cert_id} for ${cert.recipient_name} — verify at ${cert.verify_url}`,
    );

    return {
      cert_id: cert.cert_id,
      recipient_name: cert.recipient_name,
      recipient_email: cert.recipient_email ?? (this.recipientEmail || undefined),
      course: cert.course,
      issuer: cert.issuer,
      completion_date: this.completionDate || undefined,
      verify_url: cert.verify_url,
      cert_image_url: cert.cert_url,
      signed_record_url: cert.json_url,
    };
  },
};
