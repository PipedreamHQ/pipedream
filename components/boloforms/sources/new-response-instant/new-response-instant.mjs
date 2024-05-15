import boloforms from "../../boloforms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "boloforms-new-response-instant",
  name: "New Response Instant",
  description: "Emit new event when a filled form response is received.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boloforms,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    formId: {
      propDefinition: [
        boloforms,
        "formId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent form responses as historical data
      const responses = await this.boloforms.getForms({
        formId: this.formId,
      }); // Adjusted to use boloforms method
      responses.slice(0, 50).forEach((response) => {
        this.$emit(response, {
          id: response.id,
          summary: `New response from form ID: ${response.formId}`,
          ts: Date.parse(response.createdAt),
        });
      });
    },
    async activate() {
      // Assuming BoloForms supports webhook subscriptions for form responses
      const webhookId = await this.boloforms.createWebhook({
        formId: this.formId,
      }); // Placeholder for actual method
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.boloforms.deleteWebhook({
          webhookId,
        }); // Placeholder for actual method
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const response = event.body;
    if (response.formId === this.formId) {
      this.$emit(response, {
        id: response.id || `${response.formId}-${Date.now()}`,
        summary: `New response for form ID: ${response.formId}`,
        ts: response.timestamp
          ? Date.parse(response.timestamp)
          : Date.now(),
      });
    } else {
      this.http.respond({
        status: 200,
        body: "Form ID does not match",
      });
    }
  },
};
