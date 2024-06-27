import invisionCommunity from "../../invision_community.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "invision_community-new-forum-topic-instant",
  name: "New Forum Topic Instant",
  description: "Emit new event when a new topic is created. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=core/webhooks/postindex)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    invisionCommunity: {
      type: "app",
      app: "invision_community",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch for this webhook
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const response = await this.invisionCommunity._makeRequest({
        method: "POST",
        path: "/core/webhooks",
        data: {
          url: webhookUrl,
          event: "forumstopic_create",
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.invisionCommunity._makeRequest({
          method: "DELETE",
          path: `/core/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const rawBody = JSON.stringify(body);
    const secretKey = this.invisionCommunity.$auth.api_key;
    const webhookSignature = headers["x-signature"];
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    this.$emit(body, {
      id: body.id,
      summary: `New topic created: ${body.title}`,
      ts: Date.parse(body.created_at),
    });
  },
};
