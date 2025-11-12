import app from "../../calendarhero.app.mjs";
import { WEBHOOK_EVENT_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "calendarhero-new-event-instant",
  name: "New Event (Instant)",
  description:
    "Emit new event when a selected type of CalendarHero event occurs. [See the documentation](https://api.calendarhero.com/documentation#/webhook/postWebhookEvent)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    event: {
      type: "string",
      label: "Event Type",
      description: "Select the type of event that will trigger this source",
      options: WEBHOOK_EVENT_TYPE_OPTIONS,
    },
  },
  hooks: {
    async activate() {
      const {
        app,
        event,
        http: { endpoint: hookUrl },
      } = this;
      await app.createWebhook({
        event,
        data: {
          hookUrl,
        },
      });
    },
    async deactivate() {
      const {
        app,
        event,
        http: { endpoint: hookUrl },
      } = this;
      await app.deleteWebhook({
        event,
        data: {
          hookUrl,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.now();
    const id = body.id ?? ts;
    this.$emit(body, {
      id,
      summary: `New event${id
        ? ` (ID ${id})`
        : ""}`,
      ts,
    });
  },
};
