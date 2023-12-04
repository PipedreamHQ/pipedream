import app from "../../the_odds_api.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import dayjs from "dayjs";

export default {
  name: "New Sport Event",
  version: "0.0.1",
  key: "the_odds_api-new-sport-event",
  description: "Emit new event when a new sports event is listed on The Odds API.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    region: {
      type: "string",
      label: "Region",
      description: "Regions of the bookmakers to be returned",
      options: constants.REGIONS,
    },
    sport: {
      propDefinition: [
        app,
        "sport",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New sport event with ID ${data.id}`,
        ts: Date.now(),
      });
    },
    _setLastTimestamp(id) {
      this.db.set("lastTimestamp", id);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.app.getUpcomingEvents({
        sport: this.sport,
        params: {
          regions: this.region,
        },
      });

      resources.slice(0, 10).forEach(this.emitEvent);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    this._setLastTimestamp(dayjs());

    const resources = await this.app.getUpcomingEvents({
      sport: this.sport,
      params: {
        regions: this.region,
      },
    });

    resources.forEach((resource) => {
      if (dayjs(resource.commence_time) < dayjs(lastTimestamp)) return;

      this.emitEvent(resource);
    });
  },
};
