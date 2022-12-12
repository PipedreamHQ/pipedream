import patreon from "../../patreon.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    patreon,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    campaign: {
      propDefinition: [
        patreon,
        "campaign",
      ],
    },
  },
  hooks: {
    async deploy() {},
    async activate() {
      const secret = uuidv4();
      const response = await this.patreon.createWebhook({
        type: "webhook",
        secret,
        attributes: {
          uri: this.http.endpoint,
          triggers: [
            this.getTriggerType(),
          ],
        },
        relationships: {
          campaign: {
            data: {
              type: "campaign",
              id: this.campaign,
            },
          },
        },
      });
      this._setSecret(secret);
      this._setWebhookId(response.data.id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.patreon.deleteWebhook({
        id,
      });
    },
  },
  methods: {
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
};
