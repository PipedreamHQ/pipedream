import bridgeInteractivePlatform from "../../bridge_interactive_platform.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "bridge_interactive_platform-new-listing-created",
  name: "New Listing Created",
  description: "Emit new event when a new listing is created. [See the documentation](https://bridgedataoutput.com/docs/explorer/mls-data)",
  version: "0.0.1",
  type: "source",
  props: {
    bridgeInteractivePlatform,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    dataset: {
      propDefinition: [
        bridgeInteractivePlatform,
        "dataset",
      ],
    },
    near: {
      propDefinition: [
        bridgeInteractivePlatform,
        "near",
      ],
    },
    radius: {
      propDefinition: [
        bridgeInteractivePlatform,
        "radius",
      ],
    },
    box: {
      propDefinition: [
        bridgeInteractivePlatform,
        "box",
      ],
    },
    poly: {
      propDefinition: [
        bridgeInteractivePlatform,
        "poly",
      ],
    },
    geohash: {
      propDefinition: [
        bridgeInteractivePlatform,
        "geohash",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    async processEvent(limit = 100) {
      const coords = {
        near: this.near,
        poly: this.poly,
        box: this.box,
        geohash: this.geohash,
      };

      if (Object.values(coords).filter(Boolean).length > 1) {
        throw new ConfigurationError("Only one of near, poly, box, or geohash can be used");
      }

      const lastTs = this._getLastTs();
      const response = await this.bridgeInteractivePlatform.getListings({
        dataset: this.dataset,
        params: {
          near: this.near,
          radius: this.radius,
          box: this.box,
          poly: this.poly,
          geohash: this.geohash,
          sortBy: "OriginalEntryTimestamp",
          order: "desc",
          limit,
        },
      });

      if (!response?.bundle?.length) {
        return;
      };

      this._setLastTs(Date.parse(response.bundle[0].OriginalEntryTimestamp));

      const newListings = response.bundle
        .filter((listing) => Date.parse(listing.OriginalEntryTimestamp) > lastTs);
      newListings.forEach((listing) => {
        const meta = this.generateMeta(listing);
        this.$emit(listing, meta);
      });
    },
    generateMeta(listing) {
      return {
        id: listing.ListingId,
        summary: `New Listing Created: ${listing.ListingId}`,
        ts: Date.parse(listing.OriginalEntryTimestamp),
      };
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
  sampleEmit,
};
