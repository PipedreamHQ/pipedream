import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";
import { v4 as uuid } from "uuid";

export default {
  key: "crove_app-document-submitted",
  name: "Document Submitted",
  description: "Triggers when a document is submitted.",
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
      type: "string",
      label: "Template",
      description: "Template ID of template.",
      async options({ $ }) {
        var resp = await axios($, {
          url: "https://v2.api.crove.app/api/integrations/external/templates/?limit=50",
          headers: {
            "X-API-KEY": `${this.croveApp.$auth.api_key}`,
          },
          method: "GET",
        });
        resp = resp.results;
        return resp.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  hooks: {
    async activate() {
      const validationToken = uuid();

      let config = {
        url: "https://v2.api.crove.app/api/integrations/external/webhooks/templates/create/",
        headers: {
          "X-API-KEY": `${this.croveApp.$auth.api_key}`,
        },
        method: "POST",
        data: {
          template: this.template_id,
          name: `pipedream-webhook: ${validationToken}`,
          webhook_url: this.http.endpoint,
          method: "POST",
          events: [
            "document.response.submitted",
          ],
        },
      };

      const response = await this.croveApp._makeRequest(config);

      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      let config = {
        url: `https://v2.api.crove.app/api/integrations/external/webhooks/templates/${webhookId}/`,
        headers: {
          "X-API-KEY": `${this.croveApp.$auth.api_key}`,
        },
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
