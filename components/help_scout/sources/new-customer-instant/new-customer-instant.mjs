import helpScout from "../../help_scout.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "help_scout-new-customer-instant",
  name: "New Customer Added",
  description: "Emit new event when a new customer is added. [See the documentation](https://developer.helpscout.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpScout,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    customerDetails: {
      propDefinition: [
        helpScout,
        "customerDetails",
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
    _generateSecret() {
      return crypto.randomBytes(20).toString("hex");
    },
  },
  hooks: {
    async activate() {
      const url = this.http.endpoint;
      const secret = this._generateSecret();
      const events = [
        "customer.created",
      ];
      const response = await this.helpScout.createWebhook({
        url,
        events,
        secret,
      });
      this._setWebhookId(response.id);
      this.db.set("secret", secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.helpScout._baseUrl()}/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.helpScout.$auth.oauth_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const signature = this.http.headers["x-helpscout-signature"];
    const rawBody = JSON.stringify(event.body);
    const secret = this.db.get("secret");

    const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
      .digest("base64");

    if (computedSignature !== signature) {
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

    const customer = event.body.data.item;

    this.$emit(customer, {
      id: customer.id,
      summary: `New customer created: ${customer.firstName} ${customer.lastName}`,
      ts: Date.parse(event.body.data.createdAt),
    });
  },
};
