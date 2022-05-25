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
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
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
        eventType: this.getEventTypes().types,
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
    async emitEvents(events) {
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          ts: Date.parse(event.created_datetime),
          summary: `New ${event.type} event: ${event.id}`,
        });
      }
    },
  },
  async run() {
    const params = {
      cursor: this.getNextCursor(),
      ...this.getEventTypes(),
    };

    const {
      data: events,
      meta,
    } = await this.gorgias.getEvents({
      params,
    });

    this.emitEvents(events);
    this.setNextCursor(meta.next_cursor);
  },
};
