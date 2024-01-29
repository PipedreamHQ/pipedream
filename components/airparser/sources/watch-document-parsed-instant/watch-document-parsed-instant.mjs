import { axios } from "@pipedream/platform";
import airparser from "../../airparser.app.mjs";

export default {
  key: "airparser-watch-document-parsed-instant",
  name: "Watch Document Parsed Instant",
  description: "Emit new event when any document is parsed. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    airparser: {
      type: "app",
      app: "airparser",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.airparser.createWebhook({
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.airparser.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const hmac = crypto.createHmac("sha256", this.airparser.$auth.oauth_access_token);
    const signature = hmac.update(JSON.stringify(body)).digest("base64");

    if (headers["airparser-signature"] !== signature) {
      return this.http.respond({
        status: 401,
      });
    }

    this.$emit(body, {
      id: body.id,
      summary: `New document parsed: ${body.name}`,
      ts: Date.now(),
    });
  },
};
