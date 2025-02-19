import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import benchmarkone from "../../benchmarkone.app.mjs";

export default {
  key: "benchmarkone-new-webhook-automation-event-instant",
  name: "New Webhook Automation Event (Instant)",
  description: "Emit new event when a webhook automation step is triggered in BenchmarkONE. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    benchmarkone: {
      type: "app",
      app: "benchmarkone",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async fetchAutomationEvents(since = 0, limit = 100) {
      return await this.benchmarkone._makeRequest({
        method: "GET",
        path: "/automation/events",
        params: {
          since,
          limit,
        },
      });
    },
    async getLastTimestamp() {
      const lastTimestamp = await this.db.get("lastTimestamp");
      return lastTimestamp || 0;
    },
    async setLastTimestamp(timestamp) {
      await this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      try {
        const events = await this.fetchAutomationEvents();
        const sortedEvents = events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentEvents = sortedEvents.slice(0, 50).reverse();

        for (const event of recentEvents) {
          const eventTimestamp = Date.parse(event.timestamp) || Date.now();
          this.$emit(event, {
            id: event.id || eventTimestamp,
            summary: `New Automation Event: ${event.name}`,
            ts: eventTimestamp,
          });

          if (eventTimestamp > (await this.getLastTimestamp())) {
            await this.setLastTimestamp(eventTimestamp);
          }
        }
      } catch (error) {
        console.error("Error in deploy hook:", error);
      }
    },
    async activate() {
      try {
        const webhookUrl = this.$endpoints.webhook.url;
        const webhookName = "Pipedream Webhook Automation Event";

        const response = await this.benchmarkone._makeRequest({
          method: "POST",
          path: "/Webhook/Addwebhook",
          data: {
            URL: webhookUrl,
            WebHookName: webhookName,
          },
        });

        const webhookId = response.Data?.WebHookIdEncrypted;
        if (webhookId) {
          await this.db.set("webhookId", webhookId);
        } else {
          throw new Error("Failed to retrieve WebHookIdEncrypted from response.");
        }
      } catch (error) {
        console.error("Error in activate hook:", error);
      }
    },
    async deactivate() {
      try {
        const webhookId = await this.db.get("webhookId");
        if (webhookId) {
          await this.benchmarkone._makeRequest({
            method: "DELETE",
            path: `/Webhook/DeleteWebhook/${webhookId}`,
          });
          await this.db.delete("webhookId");
        }
      } catch (error) {
        console.error("Error in deactivate hook:", error);
      }
    },
  },
  async run() {
    try {
      const lastTimestamp = await this.getLastTimestamp();
      const events = await this.fetchAutomationEvents(lastTimestamp);

      let newLastTimestamp = lastTimestamp;

      for (const event of events) {
        const eventTimestamp = Date.parse(event.timestamp) || Date.now();
        if (eventTimestamp > lastTimestamp) {
          this.$emit(event, {
            id: event.id || eventTimestamp,
            summary: `New Automation Event: ${event.name}`,
            ts: eventTimestamp,
          });

          if (eventTimestamp > newLastTimestamp) {
            newLastTimestamp = eventTimestamp;
          }
        }
      }

      if (newLastTimestamp > lastTimestamp) {
        await this.setLastTimestamp(newLastTimestamp);
      }
    } catch (error) {
      console.error("Error in run method:", error);
    }
  },
};
