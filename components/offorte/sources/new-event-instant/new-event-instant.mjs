import { EVENTS_OPTIONS } from "../../common/constants.mjs";
import { snakeCaseToTitleCase } from "../../common/utils.mjs";
import offorte from "../../offorte.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "offorte-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when an event is created. [See the documentation](https://www.offorte.com/api-docs/api#tag/Webhooks/operation/webhookDetails)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    offorte,
    db: "$.service.db",
    http: "$.interface.http",
    events: {
      type: "string[]",
      label: "Events",
      description: "The events to listen for",
      options: EVENTS_OPTIONS,
    },
  },
  hooks: {
    async activate() {
      const response = await this.offorte.createHook({
        data: {
          payload_url: this.http.endpoint,
          payload_content_type: "json",
          active: true,
          events: this.events,
        },
      });
      this.db.set("webhookId", response.webhook_id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.offorte.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: `${body.data.id}-${body.date_created}`,
      summary: `New **${snakeCaseToTitleCase(body.type)}** event with ID: ${body.data.id}`,
      ts: Date.parse(body.date_created),
    });
  },
  sampleEmit,
};
