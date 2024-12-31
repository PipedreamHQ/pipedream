import opensea from "../../opensea.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "opensea-new-collection-events",
  name: "New Collection Events",
  description: "Emit new listings for a collection. [See the documentation](https://docs.opensea.io/reference/get_all_listings_on_collection_v2)",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  props: {
    opensea,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    collectionSlug: {
      type: "string",
      label: "Collection Slug",
      description: "Unique string to identify a collection on OpenSea. This can be found by visiting the collection on the OpenSea website and noting the last path parameter.",
    },
  },
  methods: {
    getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    generateMeta(item) {
      return {
        id: item.order_hash,
        summary: `New ${item.type} ${item.chain} Listing`,
        ts: item.protocol_data.parameters.startTime,
      };
    },
    async processEvent(max) {
      const lastTimestamp = this.getLastTimestamp();

      const results = this.opensea.paginate({
        fn: this.opensea.retrieveEvents,
        args: {
          collectionSlug: this.collectionSlug,
        },
        resourceKey: "listings",
      });

      let items = [];
      for await (const result of results) {
        const ts = result.protocol_data.parameters.startTime;
        if (ts >= lastTimestamp) {
          items.push(result);
        }
      }

      if (max) {
        items = items.slice(-1 * max);
      }
      this.setLastTimestamp(items[items.length - 1].protocol_data.parameters.startTime);

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
