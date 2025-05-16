import selzy from "../../selzy.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "selzy-new-subscriber-instant",
  name: "New Subscriber Instant",
  description: "Emit a new event when a new contact subscribes to a specified list. [See the documentation](https://selzy.com/en/support/api/common/event-notification-system-webhooks/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    selzy,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    listId: {
      propDefinition: [
        selzy,
        "listId",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _generateAuth(body, apiKey) {
      const modifiedBody = {
        ...body,
        auth: apiKey,
      };
      return crypto.createHash("md5").update(JSON.stringify(modifiedBody))
        .digest("hex");
    },
    _verifySignature(body, expectedAuth) {
      const actualAuth = this._generateAuth(body, this.selzy.$auth.api_key);
      return expectedAuth === actualAuth;
    },
    async _createWebhook() {
      const response = await this.selzy._makeRequest({
        method: "POST",
        path: "/setHook",
        data: {
          api_key: this.selzy.$auth.api_key,
          hook_url: this.http.endpoint,
          events: {
            "subscribe": this.listId,
          },
          event_format: "json_post",
          single_event: 1,
          status: "active",
        },
      });
      this._setWebhookId(response.hook_id);
    },
    async _removeWebhook() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.selzy._makeRequest({
          method: "POST",
          path: "/removeHook",
          data: {
            api_key: this.selzy.$auth.api_key,
            hook_id: webhookId,
          },
        });
      }
    },
  },
  hooks: {
    async deploy() {
      const subscriptions = await this.selzy._makeRequest({
        path: "/subscriptions",
        method: "GET",
      });
      const recent = subscriptions.slice(-50);
      for (const subscription of recent) {
        this.$emit(subscription, {
          id: subscription.email_id,
          summary: `New subscriber: ${subscription.email}`,
          ts: Date.parse(subscription.created_at),
        });
      }
    },
    async activate() {
      await this._createWebhook();
    },
    async deactivate() {
      await this._removeWebhook();
    },
  },
  async run(event) {
    const {
      auth, events_by_user,
    } = event.body;
    const isValid = this._verifySignature(event.body, auth);
    if (!isValid) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    for (const userEvents of events_by_user) {
      for (const eventInfo of userEvents.Events) {
        if (eventInfo.event_name === "subscribe" && eventInfo.event_data.just_subscribed_list_ids.includes(this.listId)) {
          this.$emit(eventInfo.event_data, {
            id: eventInfo.event_data.email,
            summary: `New subscriber: ${eventInfo.event_data.email}`,
            ts: Date.parse(eventInfo.event_time),
          });
        }
      }
    }
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
