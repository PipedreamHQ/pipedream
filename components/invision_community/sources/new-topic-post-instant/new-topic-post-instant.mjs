import invisionCommunity from "../../invision_community.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "invision_community-new-topic-post-instant",
  name: "New Topic Post Instant",
  description: "Emit new event when a new post in a topic is created. [See the documentation](https://invisioncommunity.com/developers/rest-api?endpoint=core/webhooks/postindex)",
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
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const sampleEvents = await this.invisionCommunity._makeRequest({
        method: "GET",
        path: "/forums/posts",
        params: {
          perPage: 50,
        },
      });

      for (const event of sampleEvents) {
        this.$emit(event, {
          id: event.id,
          summary: `New post by ${event.author_name}`,
          ts: Date.parse(event.date),
        });
      }
    },
    async activate() {
      const webhookData = {
        url: this.http.endpoint,
        events: [
          "forumstopicpost_create",
        ],
      };
      const webhook = await axios(this, {
        method: "POST",
        url: `${this.invisionCommunity._baseUrl()}/core/webhooks`,
        headers: {
          Authorization: `Bearer ${this.invisionCommunity.$auth.api_key}`,
        },
        data: webhookData,
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.invisionCommunity._baseUrl()}/core/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.invisionCommunity.$auth.api_key}`,
          },
        });
      }
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.invisionCommunity.$auth.api_key)
      .update(event.rawBody)
      .digest("base64");

    if (computedSignature !== event.headers["x-invision-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New post by ${event.body.author_name}`,
      ts: Date.parse(event.body.date),
    });
  },
};
