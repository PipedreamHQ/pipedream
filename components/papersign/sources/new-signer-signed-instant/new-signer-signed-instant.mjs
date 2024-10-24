import papersign from "../../papersign.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "papersign-new-signer-signed-instant",
  name: "New Signer Signed (Instant)",
  description: "Emit new event when a signer signs a document. [See the documentation](https://paperform.readme.io/reference/postpapersignfolderwebhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    papersign,
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
      const documents = await this.papersign.listDocuments({
        status: "signed",
      });
      const recentDocuments = documents.slice(0, 50);
      for (const doc of recentDocuments) {
        this.$emit(doc, {
          id: doc.id,
          summary: `Document signed: ${doc.name}`,
          ts: Date.parse(doc.signedAt),
        });
      }
    },
    async activate() {
      const response = await axios(this, {
        method: "POST",
        url: `${this.papersign._baseUrl()}/folders/{folderId}/webhooks`,
        headers: {
          "Authorization": `Bearer ${this.papersign.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        data: {
          name: "New Signer Signed Webhook",
          target_url: this.http.endpoint,
          scope: "folder.all_descendants",
          triggers: [
            "signer.signed",
          ],
        },
      });
      this._setWebhookId(response.webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.papersign._baseUrl()}/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.papersign.$auth.api_key}`,
          },
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-papersign-signature"];
    const secretKey = this.papersign.$auth.api_key;
    const rawBody = JSON.stringify(event.body);
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
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

    this.$emit(event.body, {
      id: event.body.signerId,
      summary: `Document signed by signer ${event.body.signerName}`,
      ts: Date.parse(event.body.signedAt),
    });
  },
};
