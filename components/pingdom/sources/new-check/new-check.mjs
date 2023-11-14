import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pingdom from "../../pingdom.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "pingdom-new-check",
  name: "New Check Created",
  description: "Emit new event when a new check is added in Pingdom. [See the documentation](https://www.pingdom.com/resources/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
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
    _getLastCheckId() {
      return this.db.get("lastCheckId") || null;
    },
    _setLastCheckId(lastCheckId) {
      this.db.set("lastCheckId", lastCheckId);
    },
    async startEvent(maxResults = false) {

      const lastCheckId = this._getLastCheckId();
      const { checks } = await this.pingdom.listChecks();
      let mostRecentChecks = maxResults
        ? checks.slice(checks.length - 25, checks.length)
        : checks;

      if (mostRecentChecks.length) {
        if (lastCheckId) mostRecentChecks.filter((item) => item.id > lastCheckId);
        this._setLastCheckId(mostRecentChecks[0].id);
      }

      for (const check of mostRecentChecks) {
        this.$emit(check, {
          id: check.id,
          summary: `New Check: ${check.name}`,
          ts: Date.parse(check.created),
        });
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
  sampleEmit,
};
