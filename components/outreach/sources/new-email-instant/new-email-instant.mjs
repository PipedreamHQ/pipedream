import { axios } from "@pipedream/platform";
import outreach from "../../outreach.app.mjs";

export default {
  key: "outreach-new-email-instant",
  name: "New Email Instant",
  description: "Emits a new event when an email is created, updated, deleted, bounced, delivered, opened or replied.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    outreach,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // 15 minutes
      },
    },
  },
  methods: {
    ...outreach.methods,
    async fetchEmailEvents(since) {
      return this.outreach._makeRequest({
        path: "/api/v2/events",
        params: {
          since,
        },
      });
    },
    generateMeta(data) {
      const {
        id, attributes: {
          eventType, subject,
        },
      } = data;
      const summary = `Email ${eventType}: ${subject}`;
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const since = this.db.get("since") || new Date().toISOString();
    const emailEvents = await this.fetchEmailEvents(since);

    if (emailEvents.length > 0) {
      emailEvents.forEach((emailEvent) => {
        const meta = this.generateMeta(emailEvent);
        this.$emit(emailEvent, meta);
      });

      // Update the latest timestamp
      const latestEmailEvent = emailEvents[emailEvents.length - 1];
      this.db.set("since", latestEmailEvent.attributes.updatedAt);
    }
  },
};
