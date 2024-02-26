import { axios } from "@pipedream/platform";
import heedjy from "../../heedjy.app.mjs";

export default {
  key: "heedjy-new-app-published-instant",
  name: "New App Published",
  description: "Emits an event when a new app is published",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heedjy: {
      type: "app",
      app: "heedjy",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const data = {
        url: this.http.endpoint,
        event_types: [
          "app.published",
        ],
      };
      const result = await this.heedjy.emitAppPublishedEvent(data);
      this.db.set("webhookId", result.id);
    },
    async deactivate() {
      const id = this.db.get("webhookId");
      await this.heedjy._makeRequest({
        method: "DELETE",
        path: `/webhooks/${id}`,
      });
    },
  },
  async run(event) {
    if (event.headers["x-heedjy-signature"] !== this.heedjy.$auth.oauth_access_token) {
      return this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
    }
    if (event.body.event_type === "app.published") {
      const {
        id, created_at, app,
      } = event.body.payload;
      this.$emit(app, {
        id,
        summary: `New app published: ${app.name}`,
        ts: +new Date(created_at),
      });
    }
  },
};
