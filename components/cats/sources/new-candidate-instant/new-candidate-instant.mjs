import cats from "../../cats.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "cats-new-candidate-instant",
  name: "New Candidate Instant",
  description: "Emit a new event when a new candidate is created. [See the documentation](https://docs.catsone.com/api/v3/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cats,
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
  },
  hooks: {
    async deploy() {
      // Fetching the most recent candidate events is not required as per the provided instructions
    },
    async activate() {
      const webhookConfig = {
        events: [
          "candidate.created",
        ],
        target_url: this.http.endpoint,
        secret: this.cats.$auth.api_key, // Using the API key as the secret for signature validation
      };

      const response = await axios(this, {
        method: "POST",
        url: `${this.cats._baseUrl()}/webhooks`,
        headers: {
          Authorization: `Bearer ${this.cats.$auth.api_key}`,
        },
        data: webhookConfig,
      });

      const webhookId = response.id;
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.cats._baseUrl()}/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.cats.$auth.api_key}`,
          },
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Signature"];
    const rawBody = JSON.stringify(event.body);
    const computedSignature = `HMAC-SHA256 ${crypto.createHmac("sha256", this.cats.$auth.api_key).update(rawBody)
      .digest("hex")}`;

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
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New candidate created: ${event.body.first_name} ${event.body.last_name}`,
      ts: Date.now(),
    });
  },
};
