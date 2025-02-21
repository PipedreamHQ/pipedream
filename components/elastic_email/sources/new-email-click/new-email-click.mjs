import { axios } from "@pipedream/platform";
import elasticEmail from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-new-email-click",
  name: "New Email Click",
  description: "Emit new event when a recipient clicks a link in an email. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    elasticEmail: {
      type: "app",
      app: "elastic_email",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      handler: async (event) => {
        const clickEvent = event.body;
        const existingEvents = (await this.db.get("events")) || [];
        existingEvents.push(clickEvent);
        await this.db.set("events", existingEvents);
        return {
          status: 200,
          body: "Webhook received",
        };
      },
    },
  },
  hooks: {
    async activate() {
      await this.elasticEmail.registerWebhook({
        webhookUrl: this.http.endpoint,
        Events: [
          "Click",
        ],
      });
    },
    async deactivate() {
      // If the elastic_email app has a method to delete webhooks, it should be called here.
      // Example:
      // await this.elasticEmail.deleteWebhook({
      //   webhookUrl: this.http.endpoint,
      // });
      // If such a method does not exist, leave this hook empty.
    },
    async deploy() {
      const events = (await this.db.get("events")) || [];
      const latestEvents = events.slice(-50).reverse();

      for (const event of latestEvents) {
        const ts = event.timestamp
          ? Date.parse(event.timestamp)
          : Date.now();
        const id = event.id || ts;
        const summary = `New Email Click by ${event.recipient}`;
        this.$emit(event, {
          id,
          summary,
          ts,
        });
      }

      // Keep only the latest 50 events
      await this.db.set("events", events.slice(-50));
    },
  },
  async run() {
    const events = (await this.db.get("events")) || [];

    for (const event of events) {
      const ts = event.timestamp
        ? Date.parse(event.timestamp)
        : Date.now();
      const id = event.id || ts;
      const summary = `New Email Click by ${event.recipient}`;
      this.$emit(event, {
        id,
        summary,
        ts,
      });
    }

    // Clear the events after emitting
    await this.db.set("events", []);
  },
};
