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
    _getNextCursor() {
      return this.db.get("nextCursor");
    },
    _setNextCursor(nextCursor) {
      this.db.set("nextCursor", nextCursor);
    },
    async getPaginatedCollectionEvents() {
      const args = {
        collectionSlug: this.collectionSlug,
        params: {
          limit: 100,
          next: this._getNextCursor(),
        },
      };

      let lastNextCursor, total = 0;
      const results = [];

      do {
        const {
          listings, next,
        } = await this.opensea.retrieveEvents(args);
        results.push(...listings);
        total = listings?.length;
        lastNextCursor = args.params.next;
        args.params.next = next;
      } while (total && args.params?.next);

      this._setNextCursor(lastNextCursor);
      return results;
    },
    emitEvents(items) {
      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    generateMeta(item) {
      return {
        id: item.order_hash,
        summary: `New ${item.type} ${item.chain} Listing`,
        ts: item.protocol_data.parameters.startTime,
      };
    },
    async processEvent(max) {
      let items = await this.getPaginatedCollectionEvents();
      if (!items?.length) {
        return;
      }
      if (max) {
        items = items.slice(-1 * max);
      }
      this.emitEvents(items);
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
