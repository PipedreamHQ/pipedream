import hubstaff from "../../hubstaff.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "hubstaff-new-schedule",
  name: "New Schedule Created",
  description: "Emit new event when a schedule is created in Hubstaff. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    hubstaff,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        hubstaff,
        "organizationId",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || null;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    async emitNewScheduleEvents() {
      const organizationId = this.organizationId;
      const schedules = await this.hubstaff.emitNewScheduleEvent({
        organizationId,
      });

      for (const schedule of schedules) {
        this.$emit(schedule, {
          id: schedule.id,
          summary: `New Schedule: ${schedule.name}`,
          ts: Date.parse(schedule.created_at),
        });
      }

      if (schedules.length) {
        this._setLastTimestamp(new Date(schedules[0].created_at).getTime());
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewScheduleEvents();
    },
    async activate() {
      // No need to implement for this polling source
    },
    async deactivate() {
      // No need to implement for this polling source
    },
  },
  async run() {
    await this.emitNewScheduleEvents();
  },
};
