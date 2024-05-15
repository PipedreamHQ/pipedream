import boloforms from "../../boloforms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "boloforms-new-template-response-instant",
  name: "New Template Response Instant",
  description: "Emit new event when a new form template response is filled.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boloforms,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    templateId: {
      propDefinition: [
        boloforms,
        "templateId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const responses = await this.boloforms.getLastTemplateResponses({
        templateId: this.templateId,
        limit: 50,
      });
      responses.forEach((response) => {
        this.$emit(response, {
          id: response.id,
          summary: `New response for template ID ${this.templateId}`,
          ts: Date.parse(response.createdAt),
        });
      });
    },
    async activate() {
      const webhookId = await this.boloforms.createTemplateResponseWebhook({
        templateId: this.templateId,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.boloforms.deleteTemplateResponseWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const response = event.body;
    if (!response || response.templateId !== this.templateId) {
      this.http.respond({
        status: 200,
        body: "Ignored, template ID does not match or missing",
      });
      return;
    }

    this.$emit(response, {
      id: response.id || `${Date.now()}-${Math.random()}`,
      summary: `New response for template ID ${this.templateId}`,
      ts: response.createdAt
        ? Date.parse(response.createdAt)
        : Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
