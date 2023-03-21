import gorgias from "../../gorgias.app.mjs";
import constants from "../common/constants.mjs";

export default {
  dedupe: "unique",
  props: {
    gorgias,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      console.log("Retrieving historical events...");
      const { data: historicalEvents } = await this.gorgias.getEvents({
        params: {
          order_by: "created_datetime:desc",
          limit: constants.HISTORICAL_EVENTS_LIMIT,
          types: this.getEventType(),
        },
      });

      const events = await Promise.all(
        historicalEvents.map((event) => this.processHistoricalEvent(event)),
      );

      for (const event of events.reverse()) {
        this.processEvent(event);
      }
    },
    async activate() {
      console.log("Creating webhook...");
      const { id } = await this.gorgias.createWebhook({
        url: this.http.endpoint,
        eventType: this.getEventType(),
      });
      this.setWebhookId(id);
      console.log(`Webhook ${id} created successfully`);
    },
    async deactivate() {
      const id = this.getWebhookId();
      console.log(`Deleting webhook ${id}...`);
      await this.gorgias.deleteWebhook({
        id,
      });
      this.setWebhookId();
      console.log(`Webhook ${id} deleted successfully`);
    },
  },
  methods: {
    getTimestampKey() {
      return this.getEventType().includes("updated")
        ? "updated_datetime"
        : "created_datetime";
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
    processHistoricalEvent() {
      throw new Error("processHistoricalEvent is not implemented");
    },
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    async retrieveTicket(id) {
      console.log(`Received ${this.getEventType()} for ticket ${id}`);
      console.log(`Fetching data for ticket ${id}`);
      return this.gorgias.retrieveTicket({
        id,
      });
    },
    emitEvent(event) {
      console.log(`Emitting event ${event.id}:`);
      console.log(event);
      const ts = Date.parse(event[this.getTimestampKey()]);
      this.$emit(event, {
        id: `${event.id}_${ts}`,
        ts,
        summary: `New ${this.getEventType()}: ${event.id}`,
      });
    },
  },
  async run(event) {
    console.log("Raw received event:");
    console.log(event);
    return this.processEvent(event.body);
  },
};
