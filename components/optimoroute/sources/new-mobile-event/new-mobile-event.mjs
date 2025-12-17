import optimoroute from "../../optimoroute.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "optimoroute-new-mobile-event",
  name: "New Mobile Event",
  description: "Emit new event when a new mobile event is received. [See the documentation](https://optimoroute.com/api/#get-mobile-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    optimoroute,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getAfterTag() {
      return this.db.get("afterTag");
    },
    _setAfterTag(afterTag) {
      this.db.set("afterTag", afterTag);
    },
    generateMeta(event) {
      return {
        id: event.unixTimestamp,
        summary: `New mobile event for order number: ${event.orderNo}`,
        ts: event.unixTimestamp,
      };
    },
    async *paginateEvents(afterTag) {
      let hasMore;
      do {
        const {
          events = [], tag, remainingEvents,
        } = await this.optimoroute.getMobileEvents({
          params: {
            after_tag: afterTag,
          },
        });
        for (const event of events) {
          yield event;
        }
        afterTag = tag;
        hasMore = remainingEvents > 0;
        if (!hasMore && afterTag?.length) {
          this._setAfterTag(afterTag);
        }
      } while (hasMore);
    },
    async processEvents(limit) {
      const afterTag = this._getAfterTag();
      let events = [];
      const results = this.paginateEvents(afterTag);
      for await (const event of results) {
        events.push(event);
      }
      if (limit) {
        events = events.slice(-1 * limit);
      }
      events.forEach((event) => {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
  sampleEmit,
};
