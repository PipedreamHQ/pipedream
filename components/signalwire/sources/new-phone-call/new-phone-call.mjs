import signalwire from "../../signalwire.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "signalwire-new-phone-call",
  name: "New Phone Call",
  description: "Emits an event when a new phone call has been logged",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    signalwire,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getPhoneCallLogs() {
      return this.db.get("phoneCallLogs") ?? [];
    },
    _setPhoneCallLogs(phoneCallLogs) {
      this.db.set("phoneCallLogs", phoneCallLogs);
    },
  },
  hooks: {
    async deploy() {
      const phoneCallLogs = await this.signalwire.listPhoneCallLogs();
      if (phoneCallLogs.length > 0) {
        this._setPhoneCallLogs(phoneCallLogs.map((log) => log.id));
      }
    },
  },
  async run() {
    const newPhoneCallLogs = await this.signalwire.listPhoneCallLogs();
    const oldPhoneCallLogs = this._getPhoneCallLogs();

    for (const phoneCallLog of newPhoneCallLogs) {
      if (!oldPhoneCallLogs.includes(phoneCallLog.id)) {
        this.$emit(phoneCallLog, {
          id: phoneCallLog.id,
          summary: `New phone call log: ${phoneCallLog.id}`,
          ts: Date.parse(phoneCallLog.created_at),
        });
      }
    }

    this._setPhoneCallLogs(newPhoneCallLogs.map((log) => log.id));
  },
};
