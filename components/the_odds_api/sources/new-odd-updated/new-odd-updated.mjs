import app from "../../the_odds_api.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  name: "New Odd Updated",
  version: "0.0.1",
  key: "the_odds_api-new-odd-updated",
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
    event: {
      propDefinition: [
        app,
        "event",
        (c) => ({
          sport: c.sport,
          region: c.region,
        }),
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: `${data.key} - ${data?.markets[0]?.last_update}`,
        summary: `New odd ${data.title}`,
        ts: Date.parse(data?.markets[0]?.last_update) ?? Date.now(),
      });
    },
    async emitAllResources() {
      const { bookmakers: resources } = await this.app.fetchCurrentOdds({
        sport: this.sport,
        event: this.event,
        params: {
          regions: this.region,
        },
      });

      resources.slice(0, 10).forEach(this.emitEvent);
    },
  },
  hooks: {
    async deploy() {
      await this.emitAllResources();
    },
  },
  async run() {
    await this.emitAllResources();
  },
};
