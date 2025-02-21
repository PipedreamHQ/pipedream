import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import elasticEmail from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a new contact is added to a mailing list. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    elasticEmail: {
      type: "app",
      app: "elastic_email",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    webhookUrl: {
      propDefinition: [
        "elastic_email",
        "webhookUrl",
      ],
    },
    listNames: {
      propDefinition: [
        "elastic_email",
        "listNames",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const params = {
        limit: 50,
      };
      if (this.listNames && this.listNames.length > 0) {
        params.listnames = this.listNames.join(",");
      }
      try {
        const contacts = await this.elasticEmail._makeRequest({
          method: "GET",
          path: "/contacts",
          params,
        });
        if (contacts && contacts.length > 0) {
          contacts.sort((a, b) => new Date(a.added_date) - new Date(b.added_date));
          for (const contact of contacts) {
            const eventTimestamp = contact.added_date
              ? Date.parse(contact.added_date)
              : Date.now();
            this.$emit(contact, {
              id: contact.email,
              summary: `New contact added: ${contact.email}`,
              ts: eventTimestamp,
            });
          }
          const latestTimestamp = Math.max(...contacts.map((c) => c.added_date
            ? Date.parse(c.added_date)
            : 0));
          this.db.set("lastRun", latestTimestamp);
        }
      } catch (error) {
        this.$emit(
          {
            error: error.message,
            stack: error.stack,
          },
          {
            summary: "Error fetching historical contacts",
            ts: Date.now(),
          },
        );
      }
    },
    async activate() {
      await this.elasticEmail.registerWebhook({
        webhookUrl: this.webhookUrl,
      });
    },
    async deactivate() {
      if (typeof this.elasticEmail.deleteWebhook === "function") {
        await this.elasticEmail.deleteWebhook({
          webhookUrl: this.webhookUrl,
        });
      }
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || 0;
    const currentTimestamp = Date.now();
    const params = {};
    if (this.listNames && this.listNames.length > 0) {
      params.listnames = this.listNames.join(",");
    }
    params.added_after = lastRun;
    try {
      const contacts = await this.elasticEmail._makeRequest({
        method: "GET",
        path: "/contacts",
        params,
      });
      if (contacts && contacts.length > 0) {
        for (const contact of contacts) {
          const eventTimestamp = contact.added_date
            ? Date.parse(contact.added_date)
            : currentTimestamp;
          this.$emit(contact, {
            id: contact.email,
            summary: `New contact added: ${contact.email}`,
            ts: eventTimestamp,
          });
        }
        this.db.set("lastRun", currentTimestamp);
      }
    } catch (error) {
      this.$emit(
        {
          error: error.message,
          stack: error.stack,
        },
        {
          summary: "Error fetching new contacts",
          ts: currentTimestamp,
        },
      );
    }
  },
};
