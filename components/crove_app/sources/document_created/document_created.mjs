import croveApp from "../../crove_app.app.mjs";
import { v4 as uuid } from "uuid";

export default {
  key: "crove_app-document-created",
  name: "Document Created",
  description: "Triggers when a new document is created.",
  version: "0.0.1",
  type: "source",
  props: {
    croveApp,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    template_id: {
      propDefinition: [
        croveApp,
        "template_id",
      ],
    },
  },
  hooks: {
    async activate() {
      const validationToken = uuid();

      let config = {
        url: `${this.croveApp._getBaseUrl()}/webhooks/templates/create/`,
        method: "POST",
        data: {
          template: this.template_id,
          name: `pipedream-webhook: ${validationToken}`,
          webhook_url: this.http.endpoint,
          method: "POST",
          events: [
            "document.created",
          ],
        },
      };

      const response = await this.croveApp._makeRequest(config);

      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      let config = {
        url: `${this.croveApp._getBaseUrl()}/webhooks/templates/${webhookId}/`,
        method: "DELETE",
      };
      await this.croveApp._makeRequest(config);
    },
  },
  async run(event) {
    const { body } = event;

    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      id: body.webhook.id,
      summary: `New event ${body.webhook.id} received`,
      ts: new Date(),
    });
  },
};
