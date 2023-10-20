import affinda from "../../affinda.app.mjs";
import crypto from "crypto";

export default {
  props: {
    affinda,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    organization: {
      propDefinition: [
        affinda,
        "organization",
      ],
    },
    webhookSignatureKey: {
      type: "string",
      label: "Webhook Signature Key",
      description: "If provided, this source will verify if the webhook comes from Affinda. Locate it in your organization settings.",
      secret: true,
      optional: true,
    },
  },
  methods: {
    _getEventType() {
      throw new Error("event type is not defined");
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      let offset = 0;
      const limit = 300;
      const documents = [];

      while (true) {
        const { results } = await this.affinda.listDocuments({
          params: {
            offset,
            limit,
          },
        });
        documents.push(...results);
        if (results.length < limit) break;
        offset += limit;
      }

      for (const { meta: document } of documents.reverse().slice(0, 50)) {
        this.$emit(document, {
          id: document.identifier,
          summary: `${document.identifier} ${document.fileName}`,
          ts: Date.parse(document.readyDt),
        });
      }
    },
    async activate() {
      const response = await this.affinda.createWebhook({
        data: {
          targetUrl: this.http.endpoint,
          event: "document.parse.completed",
          organization: this.organization,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.affinda.deleteWebhook({
        id,
      });
    },
  },
  async run(event) {
    if (event.headers["x-hook-secret"]) {
      // https://docs.affinda.com/reference/activateresthooksubscription
      const signature = event.headers["x-hook-secret"];
      await this.http.respond({
        status: 200,
        body: "OK",
        headers: {
          "x-hook-secret": signature,
        },
      });
      await this.affinda.activateWebhook({
        signature,
      });
      return;
    }

    if (!this.webhookSignatureKey) {
      console.log("skipping signature verification");
    } else {
      // https://help.affinda.com/hc/en-au/articles/11474095148569-How-do-I-create-a-webhook
      const signature = event.headers["x-hook-signature"];
      const receivedSig = signature.split(".")[1];

      const calculatedSig = crypto
        .createHmac("sha256", this.webhookSignatureKey)
        .update(event.bodyRaw)
        .digest("hex");

      if (receivedSig !== calculatedSig) {
        console.log("unauthorized request");
        return this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
      }
    }

    const document = event.body.payload;
    this.$emit(document, {
      id: document.identifier,
      summary: `${document.identifier}: ${document.fileName}`,
      ts: event.body.timestamp,
    });
  },
};
