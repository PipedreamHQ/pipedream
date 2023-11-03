import teamup from "../../teamup.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    teamup,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    calendarKey: {
      propDefinition: [
        teamup,
        "calendarKey",
      ],
    },
    subCalendarIds: {
      propDefinition: [
        teamup,
        "subCalendarIds",
        (c) => ({
          calendarKey: c.calendarKey,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event, timestamp) {
      const meta = this.generateMeta(event, timestamp);
      this.$emit(event, meta);
    },
    getParams() {
      return {};
    },
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();

    const {
      events, timestamp,
    } = await this.teamup.listEvents({
      calendarKey: this.calendarKey,
      params: {
        ...this.getParams(lastTs),
        subcalendarId: this.subCalendarIds,
      },
    });

    for (const event of events) {
      if (this.isRelevant({
        event,
        lastTs,
        timestamp,
      })) {
        this.emitEvent(event, timestamp);
      }
    }

    this._setLastTs(timestamp);
  },
};
