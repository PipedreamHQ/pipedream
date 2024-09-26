import common from "../common/base.mjs";

export default {
  ...common,
  key: "storyscale-tour-viewed",
  name: "Tour Viewed",
  description: "Emit new event when a tour is viewed. [See the documentation](https://prodapi.storyscale.com/api/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getVisitorCount() {
      return this.db.get("visitorCount") || {};
    },
    _setVisitorCount(visitorCount) {
      this.db.set("visitorCount", visitorCount);
    },
    isRelevant(tour, visitorCount) {
      if (visitorCount[tour.id]) {
        return tour.visitor_count > visitorCount[tour.id];
      }
      return tour.visitor_count > 0;
    },
    generateMeta(tour) {
      return {
        id: tour.id,
        summary: `Tour ${tour.name} Viewed`,
        ts: Date.parse(tour.updated_at),
      };
    },
    async processEvent(limit) {
      let count = 0;
      const visitorCount = this._getVisitorCount();
      const tours = await this.getRecentTours();
      for (const tour of tours) {
        if (this.isRelevant(tour, visitorCount)) {
          this.emitEvent(tour);
          count++;
        }
        visitorCount[tour.id] = tour.visitor_count;
        if (limit && count === limit) {
          break;
        }
      }
      this._setVisitorCount(visitorCount);
    },
  },
};
