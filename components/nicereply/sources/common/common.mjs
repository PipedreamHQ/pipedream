import nicereply from "../../nicereply.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    nicereply,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      throw new Error("emitEvent is not implemented", data);
    },
    getRatings() {
      throw new Error("getRatings is not implemented");
    },
    getRequestExtraArgs() {
      return {};
    },
    _setLastRatingId(id) {
      this.db.set("lastRatingId", id);
    },
    _getLastRatingId() {
      return this.db.get("lastRatingId");
    },
  },
  hooks: {
    async deploy() {
      const response = await this.getRatings()({
        ...this.getRequestExtraArgs(),
        params: {
          ...this.getRequestExtraArgs().params,
          per_page: 10,
        },
      });

      response._results.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastRatingId = this._getLastRatingId();

    let nextPageUrl = null;

    while (true) {
      const reqObj = {
        ...this.getRequestExtraArgs(),
        params: {
          ...this.getRequestExtraArgs().params,
          per_page: 100,
        },
      };

      if (nextPageUrl) {
        reqObj.url = nextPageUrl;
      }

      const response = await this.getRatings()(reqObj);
      const ratings = response._results;

      if (ratings.length) {
        this._setLastRatingId(ratings[0].id);
      }

      ratings.reverse().forEach(this.emitEvent);

      if (
        !response._pagination.links.next ||
        ratings.filter((rating) => rating.id === lastRatingId).length
      ) {
        return;
      }

      nextPageUrl = response._pagination.links.next;
    }
  },
};
