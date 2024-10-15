import paperform from "../../paperform.app.mjs";
import crypto from "crypto";

export default {
  key: "paperform-new-submission-instant",
  name: "New Submission Instant",
  description: "Emits an event when a new submission is made on a specific form in Paperform",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    paperform,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        paperform,
        "formId",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.paperform.createWebhook({
        formId: this.formId,
        endpointUrl: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      await this.paperform.deleteWebhook(this.db.get("webhookId"));
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-paperform-hmac-sha256"]) {
      const hmac = crypto.createHmac("sha256", this.paperform.$auth.api_key);
      const digest = hmac.update(JSON.stringify(body)).digest("hex");

      if (digest === headers["x-paperform-hmac-sha256"]) {
        this.http.respond({
          status: 200,
        });
        this.$emit(body, {
          id: body.id,
          summary: `New submission for form ${body.form_id}`,
          ts: Date.parse(body.created),
        });
      } else {
        this.http.respond({
          status: 401,
        });
      }
    } else {
      this.http.respond({
        status: 404,
      });
    }
  },
};
