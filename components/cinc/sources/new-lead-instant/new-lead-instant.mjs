import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-new-lead-instant",
  name: "New Lead Instant",
  description: "Emit new event when a new lead is added. [See the documentation](https://developers.cinc.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cinc: {
      type: "app",
      app: "cinc",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    leadDetails: {
      propDefinition: [
        cinc,
        "leadDetails",
      ],
    },
    leadSource: {
      propDefinition: [
        cinc,
        "leadSource",
      ],
      optional: true,
    },
    timeOfAddition: {
      propDefinition: [
        cinc,
        "timeOfAddition",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const metadata = {
        event: "new_lead",
      };
      const { id } = await this.cinc.createWebhook(metadata);
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const id = this.db.get("webhookId");
      if (id) {
        await this.cinc.deleteWebhook(id);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["X-Cinc-Hook-Signature"] !== this.cinc.$auth.webhook_signing_secret) {
      return this.http.respond({
        status: 401,
      });
    }

    this.$emit(body, {
      id: body.id,
      summary: `New lead added: ${body.id}`,
      ts: Date.now(),
    });
  },
};
