import klenty from "../../klenty.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "klenty-prospect-imported",
  name: "Prospect Imported",
  description: "Emits an event when a new prospect is imported to Klenty.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    klenty,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    event: {
      propDefinition: [
        klenty,
        "event",
        () => ({
          event: "sendprospect",
        }),
      ],
    },
  },
  methods: {
    generateId() {
      return `${Math.floor(Math.random() * 1000000)}`;
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical events
      const { data } = await this.klenty.getProspectsByList({
        params: {
          start: 0,
        },
      });
      const eventsToEmit = data.items.slice(-50).reverse();
      for (const event of eventsToEmit) {
        this.$emit(event, {
          id: event.id,
          summary: `New prospect ${event.Email} imported`,
          ts: Date.parse(event.timestamp) || +new Date(),
        });
      }
    },
    async activate() {
      const { data } = await this.klenty.createWebhook({
        event: this.event,
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.klenty.deleteWebhook({
          id: webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Assuming Klenty sends a signature header to verify the webhook
    // Replace `YOUR_KLENTY_SIGNATURE_SECRET` with the actual environment variable or secret
    const klentySignature = headers["X-Klenty-Signature"];
    const secret = process.env.YOUR_KLENTY_SIGNATURE_SECRET;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (klentySignature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: {
          message: "Invalid signature",
        },
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: {
        message: "Webhook received",
      },
    });

    // Emit the new prospect event
    this.$emit(body, {
      id: body.id || body.prospect || this.generateId(),
      summary: `New prospect imported: ${body.Email}`,
      ts: body.ts
        ? Date.parse(body.ts)
        : +new Date(),
    });
  },
};
