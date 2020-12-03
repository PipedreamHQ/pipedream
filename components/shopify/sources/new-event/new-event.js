const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-new-event",
  name: "New Events",
  description: "Emits an event for each new Shopify event.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
    eventTypes: { propDefinition: [shopify, "eventTypes"] },
  },
  methods: {
    emitEvents(results, eventType) {
      for (const event of results) {
        this.$emit(event, {
          id: event.id,
          summary: event.message,
          ts: Date.now(),
        });
        if (results[results.length - 1])
          this.db.set(eventType, results[results.length - 1].id);
      }
    },
  },
  async run() {
    let sinceId = this.db.get("since_id") || null;
    if (this.eventTypes.length === 0) {
      // if no event type is specified
      let results = await this.shopify.getEvents(sinceId);
      this.emitEvents(results, "since_id");
    } else {
      for (const eventType of this.eventTypes) {
        sinceId = this.db.get(eventType) || sinceId;
        let results = await this.shopify.getEvents(
          sinceId,
          JSON.parse(eventType).filter,
          JSON.parse(eventType).verb
        );
        this.emitEvents(results, eventType);
      }
    }
  },
};