import rocketchat from "../../rocketchat.app.mjs";

export default {
  key: "rocketchat-new-user-instant",
  name: "New User Instant",
  description: "Emit new event when a new user is created in RocketChat. [See the documentation](https://developer.rocket.chat/reference/api/rest-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    rocketchat: {
      type: "app",
      app: "rocketchat",
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
        type: "user",
        event: "inserted",
        enabled: true,
        url: this.http.endpoint,
      };
      const { webhook: createdWebhook } = await this.rocketchat._makeRequest({
        method: "POST",
        path: "/api/v1/integrations.create",
        data: webhook,
      });
      this.db.set("webhookId", createdWebhook._id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.rocketchat._makeRequest({
        method: "DELETE",
        path: `/api/v1/integrations.remove/${webhookId}`,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-event"] !== "UserCreated") return;

    this.$emit(body, {
      id: body.user._id,
      summary: `New user ${body.user.username} created`,
      ts: Date.now(),
    });
  },
};
