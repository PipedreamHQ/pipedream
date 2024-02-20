import tableau from "../../tableau.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "tableau-site-created-instant",
  name: "New Site Created (Instant)",
  description: "Emit new event when a site is created in Tableau. [See the documentation](https://help.tableau.com/current/developer/webhooks/en-us/docs/webhooks-events-payload.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tableau: {
      type: "app",
      app: "tableau",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const events = await this.tableau.listProjects({
        siteId: this.tableau.$auth.site_id,
      });
      // Assuming listProjects returns the events sorted by createdAt, descending
      const recentEvents = events.slice(0, 50).reverse();
      for (const event of recentEvents) {
        this.$emit(event, {
          summary: `New site created: ${event.name}`,
          id: event.id,
          ts: Date.parse(event.createdAt),
        });
      }
    },
    async activate() {
      const webhookName = "Pipedream Source - Site Created";
      const eventName = "webhook-source-event-site-created";
      const webhookUrl = this.http.endpoint;

      const { webhook } = await this.tableau.createWebhook({
        siteId: this.tableau.$auth.site_id,
        webhookName,
        eventName,
        webhookUrl,
      });

      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.tableau.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const secretKey = this.tableau.$auth.oauth_access_token;
    const computedSignature = crypto.createHmac("sha256", secretKey).update(JSON.stringify(body))
      .digest("base64");

    if (computedSignature !== headers["Tableau-Signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (body.event_type === "webhook-source-event-site-created") {
      this.$emit(body, {
        summary: `New site created: ${body.resource_name}`,
        id: body.resource_luid,
        ts: Date.parse(body.created_at),
      });
    } else {
      this.http.respond({
        status: 200,
        body: "Event type does not match 'Site Created'",
      });
    }
  },
};
