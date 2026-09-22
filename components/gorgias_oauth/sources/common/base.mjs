import gorgias_oauth from "../../gorgias_oauth.app.mjs";
import constants from "../common/constants.mjs";

export default {
  dedupe: "unique",
  props: {
    gorgias_oauth,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      console.log("Retrieving historical events...");
      const { data: historicalEvents } = await this.gorgias_oauth.getEvents({
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
      const { id } = await this.gorgias_oauth.createWebhook({
        url: this.http.endpoint,
        eventType: this.getEventType(),
      });
      this.setWebhookId(id);
      console.log(`Webhook ${id} created successfully`);
    },
    async deactivate() {
      const id = this.getWebhookId();
      console.log(`Deleting webhook ${id}...`);
      await this.gorgias_oauth.deleteWebhook({
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
      return this.gorgias_oauth.retrieveTicket({
        id,
      });
    },
    async getTicketCustomFields(ticketId) {
      try {
        const { data: customFieldValues } = await this.gorgias_oauth.listTicketFieldValues({
          ticketId,
        });
        return customFieldValues || [];
      } catch (error) {
        console.error(`Error fetching custom fields for ticket ${ticketId}: ${error?.message ?? error}`);
        return [];
      }
    },
    async enrichTicketWithCustomFields(ticket) {
      const customFields = await this.getTicketCustomFields(ticket.id);
      return {
        ...ticket,
        custom_fields: customFields,
      };
    },
    emitEvent(event) {
      console.log(`Emitting event ${event.id}`);
      const ts = Date.parse(event[this.getTimestampKey()]);
      this.$emit(event, {
        id: `${event.id}_${ts}`,
        ts,
        summary: `New ${this.getEventType()}: ${event.id}`,
      });
    },
  },
  async run(event) {
    return this.processEvent(event.body);
  },
};
