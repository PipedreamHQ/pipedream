import documentpro from "../../documentpro.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "documentpro-new-document-instant",
  name: "New Document Uploaded",
  description: "Emit new event when a document is uploaded. [See the documentation](https://docs.documentpro.ai/docs/integrations/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    documentpro: {
      type: "app",
      app: "documentpro",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    account: {
      propDefinition: [
        documentpro,
        "account",
      ],
    },
    documentType: {
      propDefinition: [
        documentpro,
        "documentType",
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
    _computeSignature(secretKey, rawBody) {
      return crypto.createHmac("sha256", secretKey).update(rawBody)
        .digest("base64");
    },
  },
  hooks: {
    async deploy() {
      const events = await this.documentpro.getParsers({
        paginate: true,
        max: 50,
      });
      for (const event of events) {
        this.$emit(event, {
          id: event.template_id,
          summary: `New document uploaded: ${event.template_title}`,
          ts: Date.parse(event.created_at),
        });
      }
    },
    async activate() {
      const hookId = await this.documentpro.emitNewDocumentEvent({
        account: this.account,
        documentType: this.documentType,
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.documentpro.deleteWebhook(id);
    },
  },
  async run(event) {
    const rawBody = event.body;
    const webhookSignature = event.headers["x-webhook-signature"];
    const secretKey = this.documentpro.$auth.api_key;
    const computedSignature = this._computeSignature(secretKey, rawBody);

    if (computedSignature !== webhookSignature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const { data } = event;
    this.$emit(data, {
      id: data.request_id,
      summary: `New document uploaded: ${data.response_body.file_name}`,
      ts: Date.parse(data.timestamp),
    });
  },
};
