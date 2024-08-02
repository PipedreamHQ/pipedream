import whautomate from "../../whautomate.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "whautomate-new-client-created-instant",
  name: "New Client Created",
  description: "Emit new event when a new client is created in Whautomate. [See the documentation](https://help.whautomate.com/product-guides/integrations/webhooks/clients)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whautomate: {
      type: "app",
      app: "whautomate",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    clientDetails: {
      propDefinition: [
        whautomate,
        "clientDetails",
      ],
    },
    assignedAgentId: {
      propDefinition: [
        whautomate,
        "assignedAgentId",
      ],
      optional: true,
    },
    preferredCommunicationMethod: {
      propDefinition: [
        whautomate,
        "preferredCommunicationMethod",
      ],
      optional: true,
    },
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
      // No historical data fetching required
    },
    async activate() {
      const webhookId = await this.whautomate.emitNewClientCreated({
        clientDetails: this.clientDetails,
        assignedAgentId: this.assignedAgentId,
        preferredCommunicationMethod: this.preferredCommunicationMethod,
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.whautomate._baseUrl()}/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.whautomate.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const secretKey = this.whautomate.$auth.webhook_secret;
    const webhookSignature = headers["x-whautomate-signature"];
    const rawBody = JSON.stringify(body);

    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
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
      id: body.client.id,
      summary: `New client created: ${body.client.fullName}`,
      ts: Date.parse(body.client.createdAt),
    });
  },
};
