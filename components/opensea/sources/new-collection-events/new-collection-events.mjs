import opensea from "../../opensea.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import md5 from "md5";

export default {
  key: "opensea-new-collection-events",
  name: "New Collection Events",
  description: "Emit new filtered events for a collection. [See the documentation](https://docs.opensea.io/reference/list_events_by_collection)",
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
    eventType: {
      type: "string",
      options: [
        "all",
        "cancel",
        "listing",
        "offer",
        "order",
        "redemption",
        "sale",
        "transfer",
      ],
      label: "Event Type",
      description: "The type of event to filter by",
      default: "all",
      optional: true,
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    generateMeta(event) {
      return {
        id: md5(JSON.stringify(event)),
        summary: `New ${event.event_type} event`,
        ts: event.event_timestamp,
      };
    },
    async processEvent(max) {
      const lastTimestamp = this._getLastTimestamp();
      let next = null;
      let events = [];
      do {
        const resp = await this.opensea.retrieveEvents({
          collectionSlug: this.collectionSlug,
          params: {
            event_type: this.eventType,
            after: lastTimestamp,
            next,
          },
        });
        if (!resp?.asset_events) {
          break;
        }
        events.push(...resp.asset_events);
        next = resp.next;
      } while (lastTimestamp && next);

      if (!events.length) {
        return;
      }
      this._setLastTimestamp(events[0].event_timestamp);
      if (max) {
        events = events.slice(0, max);
      }
      events.reverse().forEach((event) => {
        this.$emit(event, this.generateMeta(event));
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
