import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "../../common/constants.mjs";

export default {
  props: {
    crowdstrikeFalcon,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastCreatedTimestamp");
    },
    _setLastTimestamp(ts) {
      this.db.set("lastCreatedTimestamp", ts);
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents(100);
  },
};
