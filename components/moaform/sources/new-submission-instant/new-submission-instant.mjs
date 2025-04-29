import crypto from "crypto";
import { RETENTION_DAYS_OPTIONS } from "../../common/constants.mjs";
import moaform from "../../moaform.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "moaform-new-submission-instant",
  name: "New Submission (Instant)",
  description: "Emit new event every time a new form submission is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    moaform,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        moaform,
        "formId",
      ],
    },
    retentionDays: {
      type: "integer",
      label: "Retention Days",
      description: "Resend restriction days",
      options: RETENTION_DAYS_OPTIONS,
      optional: true,
    },
    secret: {
      type: "string",
      label: "Secret Code",
      description: "This code is used to verify that the data received at the specified endpoint has indeed been sent from Moaform and has not been tampered with.",
      secret: true,
      optional: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async activate() {
      const response = await this.moaform.createWebhook({
        formId: this.formId,
        data: {
          endpoint: this.http.endpoint,
          enabled: true,
          secret: this.secret,
          verify_ssl: true,
          retention_days: this.retentionDays,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.moaform.deleteWebhook({
        formId: this.formId,
        webhookId,
      });
    },
  },
  async run({
    bodyRaw, body, headers,
  }) {

    if (this.secret) {
      const signature = headers["moaform-signature"];
      const receivedSig = signature.split("sha256=")[1];

      const calculatedSig = crypto
        .createHmac("sha256", this.secret)
        .update(bodyRaw)
        .digest("base64");

      if (receivedSig !== calculatedSig) {
        return this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
      }
    }

    const ts = Date.parse(body.submitted_at);
    this.$emit(body, {
      id: body.event_id,
      summary: `New submission received for form ${this.formId}`,
      ts: ts,
    });
  },
  sampleEmit,
};
