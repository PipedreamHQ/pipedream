import vida from "../../vida.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "vida-new-incoming-conversation-instant",
  name: "New Incoming Conversation Instant",
  description: "Emit a new event when an incoming call or message is received before answered by an agent. Useful for providing context about the caller or messenger to your agent before response. [See the documentation](https://vida.io/docs/api-reference/webhooks/add-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vida,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    agent: {
      propDefinition: [
        vida,
        "agent",
      ],
    },
    communicationSource: {
      propDefinition: [
        vida,
        "communicationSource",
      ],
    },
  },
  methods: {
    async activate() {
      const webhookResponse = await this.vida._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: this.http.endpoint,
          label: "Pipedream Vida Webhook",
          type: "conversation",
        },
      });
      this.db.set("webhookId", webhookResponse.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.vida._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.vida.$auth.api_token).update(event.body.rawBody)
      .digest("base64");
    if (computedSignature !== event.headers["x-vida-signature"]) {
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
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New incoming ${event.body.communicationSource} from ${event.body.source}`,
      ts: Date.now(),
    });
  },
};
