import rocketchat from "../../rocketchat.app.mjs";

export default {
  key: "rocketchat-new-message-public-channel-instant",
  name: "New Message in Public Channel (Instant)",
  description: "Emit an event when a new message is posted to a specific public channel",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rocketchat,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    targetChannel: {
      propDefinition: [
        rocketchat,
        "targetChannel",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = {
        url: this.http.endpoint,
        channel: this.targetChannel,
      };
      const { webhook } = await this.rocketchat.createWebhook(data);
      this.db.set("webhookId", webhook._id);
    },
    async deactivate() {
      await this.rocketchat.deleteWebhook({
        webhookId: this.db.get("webhookId"),
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const {
      body, headers,
    } = event;

    if (headers["x-rocketchat-livechat-token"] !== this.rocketchat.$auth.api_key) {
      return;
    }

    if (body && body.fields && body.fields.args) {
      const {
        channel, msg, user,
      } = body.fields.args[0];
      if (channel._id === this.targetChannel) {
        this.$emit(body, {
          id: body._id,
          summary: `New message from ${user.username}: ${msg}`,
          ts: Date.now(),
        });
      }
    }
  },
};
