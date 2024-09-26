import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pingdom from "../../pingdom.app.mjs";

export default {
  props: {
    pingdom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    filterArray(mostRecentAlerts) {
      return mostRecentAlerts;
    },
    async startEvent(maxResults = false) {
      const lastInfo = this.getLastInfo();
      const responseArray = await this.getItems(lastInfo);

      let mostRecentChecks = [];

      if (responseArray.length) {
        mostRecentChecks.push(
          ...maxResults
            ? responseArray.slice(responseArray.length - maxResults, responseArray.length)
            : responseArray,
        );

        mostRecentChecks = this.filterArray(mostRecentChecks, lastInfo);
        this.setLastInfo(mostRecentChecks[0]);
      }

      for (const item of mostRecentChecks) {
        this.$emit(item, this.getObjToEmit(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
