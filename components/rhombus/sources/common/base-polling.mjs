import rhombus from "../../rhombus.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    rhombus,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const { auditEvents } = await this.rhombus.getAuditFeed({
        data: {
          includeActions: this.getActions(),
          timestampMsAfter: lastTs,
        },
      });
      if (!auditEvents?.length) {
        return;
      }
      this._setLastTs(auditEvents[0].timestamp);
      auditEvents.slice(0, max).forEach((event) => {
        this.$emit(event, {
          id: event.uuid,
          summary: event.displayText,
          ts: event.timestamp,
        });
      });
    },
    getActions() {
      throw new ConfigurationError("getActions is not implemented");
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
