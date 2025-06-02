import beekeeper from "../../beekeeper.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "beekeeper-new-user-created-instant",
  name: "New User Created",
  description: "Emit a new event when a new user is created. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/1ba495ce70084-register-a-new-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    beekeeper,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical data if available
      const users = await this.beekeeper.listUsers();
      users.slice(0, 50).forEach((user) => {
        this.$emit(user, {
          id: user.id,
          summary: `User Created: ${user.display_name}`,
          ts: Date.parse(user.created),
        });
      });
    },
    async activate() {
      const response = await this.beekeeper._makeRequest({
        method: "POST",
        path: "/api/2/webhooks",
        data: {
          event: "user.created",
          url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.beekeeper._makeRequest({
          method: "DELETE",
          path: `/api/2/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const secret = this.beekeeper.$auth.api_secret;

    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("base64");
    const webhookSignature = headers["x-webhook-signature"];

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const userCreatedEvent = JSON.parse(body);
    this.$emit(userCreatedEvent, {
      id: userCreatedEvent.id,
      summary: `New user created: ${userCreatedEvent.display_name}`,
      ts: Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
