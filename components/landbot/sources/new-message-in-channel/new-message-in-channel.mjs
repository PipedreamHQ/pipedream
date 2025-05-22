import landbot from "../../landbot.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "landbot-new-message-in-channel",
  name: "New Message in Channel (Instant)",
  description: "Emit new events when a new message is sent in a channel. [See the documentation](https://api.landbot.io/#api-MessageHooks-PostHttpsApiLandbotIoV1ChannelsChannel_idMessage_hooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    landbot,
    db: "$.service.db",
    http: "$.interface.http",
    channelId: {
      propDefinition: [
        landbot,
        "channelId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { hook } = await this.landbot.createWebhook({
        channelId: this.channelId,
        data: {
          url: this.http.endpoint,
        },
      });
      this._setHookId(hook.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.landbot.deleteWebhook({
          channelId: this.channelId,
          webhookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(message) {
      return {
        id: message.timestamp,
        summary: `New ${message.type} message in channel`,
        ts: message.timestamp,
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body || !body.messages) {
      return;
    }
    for (const message of body.messages) {
      const meta = this.generateMeta(message);
      this.$emit(message, meta);
    }
  },
  sampleEmit,
};

