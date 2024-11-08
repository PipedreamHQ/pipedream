import helpScout from "../../help_scout.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "help_scout-new-conversation-assigned-instant",
  name: "New Conversation Assigned",
  description: "Emit new event when a conversation is assigned to an agent. [See the documentation](https://developer.helpscout.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpScout,
    agentId: {
      propDefinition: [
        helpScout,
        "agentId",
      ],
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
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _verifySignature(headerSignature, body) {
      const secret = this._getSecret();
      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("base64");
      return headerSignature === computedSignature;
    },
  },
  hooks: {
    async activate() {
      const events = [
        "convo.assigned",
      ];
      const url = this.http.endpoint;
      const secret = crypto.randomBytes(20).toString("hex");
      const { id } = await this.helpScout.createWebhook({
        url,
        events,
        secret,
      });
      this._setWebhookId(id);
      this._setSecret(secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.helpScout._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const headerSignature = event.headers["x-helpscout-signature"];
    const body = event.bodyRaw;
    if (!this._verifySignature(headerSignature, body)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const data = JSON.parse(body);
    if (data.event === "convo.assigned" && data.agent.id === this.agentId) {
      this.$emit(data, {
        id: data.id,
        summary: `New conversation assigned to ${this.agentId}`,
        ts: Date.parse(data.changedAt),
      });
    }

    this.http.respond({
      status: 200,
    });
  },
};
