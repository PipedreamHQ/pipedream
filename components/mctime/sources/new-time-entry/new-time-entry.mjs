import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import mctime from "../../mctime.app.mjs";

export default {
  key: "mctime-new-time-entry",
  name: "New Time Entry",
  description: "Emits an event each time a new time entry is added",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    mctime,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastEventId() {
      return this.db.get("lastEventId") || 0;
    },
    _setLastEventId(id) {
      this.db.set("lastEventId", id);
    },
    generateMeta(data) {
      const {
        id, created,
      } = data;
      return {
        id,
        summary: `New Time Entry: ${id}`,
        ts: Date.parse(created),
      };
    },
  },
  hooks: {
    async deploy() {
      const timeEntries = await this.mctime.getTimeEntries();
      if (timeEntries.length > 0) {
        const lastEventId = timeEntries[0].id;
        this._setLastEventId(lastEventId);
      }
    },
  },
  async run() {
    const timeEntries = await this.mctime.getTimeEntries();
    const lastEventId = this._getLastEventId();

    for (const timeEntry of timeEntries) {
      if (timeEntry.id > lastEventId) {
        this.$emit(timeEntry, this.generateMeta(timeEntry));
        this._setLastEventId(timeEntry.id);
      } else {
        break;
      }
    }
  },
};
