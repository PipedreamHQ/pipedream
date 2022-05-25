import gorgias from "../../gorgias.app.mjs";

export default {
  dedupe: "unique",
  props: {
    gorgias,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      // Retrieve historical events

      // const params = {
      //   cursor: this.getNextCursor(),
      // };

      // const {
      //   data: events,
      //   meta,
      // } = await this.gorgias.getEvents({
      //   params,
      // });

      // this.emitEvents(events);
      // this.setNextCursor(meta.next_cursor);
      await this.createWebhook();
    },
    async activate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        console.log(`Webhook ${webhookId} active`);
      } else {
        await this.createWebhook();
      }
    },
    async deactivate() {
      await this.deleteWebhook();
    },
  },
  methods: {
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getData() {
      throw new Error("getData is not implemented");
    },
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getNextCursor() {
      return this.db.get("nextCursor");
    },
    setNextCursor(nextCursor) {
      if (nextCursor) {
        this.db.set("nextCursor", nextCursor);
      }
    },
    async createWebhook() {
      console.log("Creating webhook...");
      const { id } = await this.gorgias.createWebhook({
        url: this.http.endpoint,
        eventType: this.getEventType(),
        form: this.getData(),
      });
      this.setWebhookId(id);
      console.log(`Webhook ${id} created successfully`);
    },
    async deleteWebhook() {
      const id = this.getWebhookId();
      console.log(`Deleting webhook ${id}...`);
      await this.gorgias.deleteWebhook({
        id,
      });
      this.setWebhookId(null);
      console.log(`Webhook ${id} deleted successfully`);
    },
    async retrieveTicket(id) {
      console.log(`Received ${this.getEventType()} for ticket ${id}`);
      console.log(`Fetching data for ticket ${id}`);
      return this.gorgias.retrieveTicket({
        id,
      });
    },
    async emitEvent(event, ts) {
      console.log(`Emitting event ${event.id}:`);
      console.log(event);
      this.$emit(event, {
        id: event.id,
        ts: Date.parse(ts),
        summary: `New ${this.getEventType()}: ${event.id}`,
      });
    },
  },
};
