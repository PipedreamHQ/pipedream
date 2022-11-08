import shopify from "../../shopify.app.mjs";
import Bottleneck from "bottleneck";
// limiting requests to 2 per second per Shopify's API rate limit documentation
// https://shopify.dev/concepts/about-apis/rate-limits
const limiter = new Bottleneck({
  minTime: 500,
});

export default {
  key: "shopify-new-event",
  name: "New Events",
  type: "source",
  description: "Emit new event for each new Shopify event.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    shopify,
    eventTypes: {
      propDefinition: [
        shopify,
        "eventTypes",
      ],
    },
  },
  methods: {
    emitEvents(results, eventType) {
      for (const event of results) {
        this.$emit(event, {
          id: event.id,
          summary: event.message,
          ts: Date.now(),
        });
      }
      if (results[results.length - 1])
        this.db.set(eventType, results[results.length - 1].id);
    },
    async getEvents(eventType, sinceId) {
      const results = await this.shopify.getEvents(
        sinceId,
        JSON.parse(eventType).filter,
        JSON.parse(eventType).verb,
      );
      return {
        results,
        eventType,
      };
    },
  },
  async run() {
    let sinceId = this.db.get("since_id") || null;

    // if no event types have been specified, emit all events
    if (this.eventTypes.length === 0) {
      // if no event type is specified
      const events = await this.shopify.getEvents(sinceId);
      this.emitEvents(events, "since_id");
      return;
    }
    const throttledGetEvents = limiter.wrap(this.getEvents);
    const allThePromises = this.eventTypes.map((eventType) => {
      sinceId = this.db.get(eventType) || sinceId;
      return throttledGetEvents(eventType, sinceId);
    });
    try {
      const results = await Promise.all(allThePromises);
      for (const result of results) {
        this.emitEvents(result.results, result.eventType);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
};
