import scrapegraphai from "../../scrapegraphai.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapegraphai-new-data-available-instant",
  name: "New Data Available - Instant",
  description: "Emit new event when new data becomes available from a scraping job. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    scrapegraphai: {
      type: "app",
      app: "scrapegraphai",
    },
    dataTypeFilter: {
      propDefinition: [
        "scrapegraphai",
        "dataTypeFilter",
      ],
      optional: true,
    },
    scrapingTaskNameFilter: {
      propDefinition: [
        "scrapegraphai",
        "scrapingTaskNameFilter",
      ],
      optional: true,
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const events = await this.paginate(
        this.scrapegraphai.onNewDataAvailable,
        {
          dataTypeFilter: this.dataTypeFilter,
          scrapingTaskNameFilter: this.scrapingTaskNameFilter,
        },
      );
      const recentEvents = events.slice(-50);
      // Emit from oldest to newest
      for (const event of recentEvents) {
        const id = event.id || event.ts || Date.now();
        const ts = event.ts
          ? Date.parse(event.ts)
          : Date.now();
        const summary = `New data available: ${event.dataType || "Unknown Data Type"}`;
        this.$emit(event, {
          id,
          summary,
          ts,
        });
      }
    },
    async activate() {
      // Register webhook and save the webhook ID
      const webhookResponse = await this.scrapegraphai.createWebhook({
        callbackUrl: this.http.endpoint,
        dataTypeFilter: this.dataTypeFilter,
        scrapingTaskNameFilter: this.scrapingTaskNameFilter,
      });
      const webhookId = webhookResponse.id;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.scrapegraphai.deleteWebhook({
          webhookId,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-signature"];
    const rawBody = event.raw_body;
    const secretKey = this.scrapegraphai.$auth.secret_key;
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const data = event.body;
    const id = data.id || data.ts || Date.now();
    const ts = data.timestamp
      ? Date.parse(data.timestamp)
      : Date.now();
    const summary = `New data available: ${data.dataType || "Unknown Data Type"}`;

    this.$emit(data, {
      id,
      summary,
      ts,
    });
  },
};
