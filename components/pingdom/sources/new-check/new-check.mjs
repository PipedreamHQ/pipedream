import pingdom from "../../pingdom.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "pingdom-new-check",
  name: "New Check",
  description: "Emit new event when a new check is added. [See the documentation](https://docs.pingdom.com/api/)",
  version: "0.0.{{ts}}",
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
  hooks: {
    async deploy() {
      // Fetch all checks to get the latest checks on the first run
      const checks = await this.pingdom.getChecks();
      // Store the ID of the most recent check for the next run
      if (checks.length > 0) {
        this.db.set("last_check_id", checks[0].id);
      }
      // Emit up to 50 most recent checks
      const recentChecks = checks.slice(0, 50).reverse();
      for (const check of recentChecks) {
        this.$emit(check, {
          id: check.id,
          summary: `New Check: ${check.name}`,
          ts: Date.parse(check.created),
        });
      }
    },
  },
  methods: {
    isCheckNew(check) {
      const lastCheckId = this.db.get("last_check_id");
      return lastCheckId === undefined || check.id > lastCheckId;
    },
    updateLastCheckId(check) {
      this.db.set("last_check_id", check.id);
    },
  },
  async run() {
    // Fetch all checks to detect new ones
    const checks = await this.pingdom.getChecks();

    // Process new checks and emit events
    for (const check of checks) {
      if (this.isCheckNew(check)) {
        this.$emit(check, {
          id: check.id,
          summary: `New Check: ${check.name}`,
          ts: Date.parse(check.created),
        });
        this.updateLastCheckId(check);
      }
    }
  },
};
