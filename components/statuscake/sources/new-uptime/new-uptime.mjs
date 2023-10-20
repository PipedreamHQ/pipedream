import statuscake from "../../statuscake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Uptime",
  version: "0.0.3",
  key: "statuscake-new-uptime",
  description: "Emit new event for each uptime created.",
  type: "source",
  dedupe: "unique",
  props: {
    statuscake,
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
      this.$emit(data, {
        id: data.id,
        summary: `New uptime with id ${data.id}`,
        ts: new Date(),
      });

      this._setLastUptimeId(data.id);
    },
    _setLastUptimeId(alarmId) {
      this.db.set("lastUptimeId", alarmId);
    },
    _getLastUptimeId() {
      this.db.get("lastUptimeId");
    },
  },
  hooks: {
    async deploy() {
      const uptimes = await this.statuscake.getUptimes({
        uptimeId: this.uptimeId,
        params: {
          limit: 10,
        },
      });

      uptimes.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastUptimeId = this._getLastUptimeId();

    let page = 1;

    while (true) {
      const uptimes = await this.statuscake.getUptimes({
        params: {
          page,
          limit: 100,
        },
      });

      uptimes.reverse().forEach(this.emitEvent);

      const uptimeIds = uptimes.map((uptime) => uptime.id);

      if (uptimes.length < 100 || uptimeIds.includes(lastUptimeId)) {
        return;
      }

      page++;
    }
  },
};
