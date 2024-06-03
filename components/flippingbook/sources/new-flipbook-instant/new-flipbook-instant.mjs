import axios from "@pipedream/platform";
import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-new-flipbook-instant",
  name: "New Flipbook Instant",
  description: "Emits a new event when a new flipbook is created. [See the documentation](https://apidocs.flippingbook.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    flippingbook: {
      type: "app",
      app: "flippingbook",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhook = {
        trigger: {
          triggerOn: [
            "publication",
          ],
          events: [
            "created",
          ],
          endpoint: this.http.endpoint,
          limitTo: null,
        },
      };
      const { id } = await this.flippingbook._makeRequest({
        method: "POST",
        path: "/api/v1/fbonline/triggers",
        data: webhook,
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.flippingbook._makeRequest({
        method: "DELETE",
        path: `/api/v1/fbonline/triggers/${webhookId}`,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["X-Hook-Secret"]) {
      this.http.respond({
        status: 200,
        headers: {
          "X-Hook-Secret": headers["X-Hook-Secret"],
        },
      });
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `New flipbook created: ${body.title}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
