import ignisign from "../../ignisign.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "ignisign-new-signature-proof-instant",
  name: "New Signature Proof Instant",
  description: "Emit new event when a signature proof is generated. [See the documentation](https://ignisign.io/docs/webhooks/signatureproof)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ignisign,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const [
        response,
      ] = await this.ignisign.createWebhook({
        data: {
          url: this.http.endpoint,
          description: this.description,
        },
      });
      await this.ignisign.disableWebhookEvents(response._id);
      this._setHookId(response._id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.ignisign.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.signatureRequestId}-${ts}`,
      summary: `New signature proof generated for signature request ID: ${body.content.signatureRequestId}`,
      ts: ts,
    });
  },
  sampleEmit,
};
