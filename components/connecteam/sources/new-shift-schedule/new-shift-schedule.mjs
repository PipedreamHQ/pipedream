import { axios } from "@pipedream/platform";
import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-new-shift-schedule",
  name: "New Shift Schedule",
  description: "Emit new event when new shifts are created. [See the documentation](https://developer.connecteam.com/reference/get_shifts_scheduler_v1_schedulers__schedulerid__shifts_get)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    connecteam,
    db: "$.service.db",
    schedulerId: {
      propDefinition: [
        connecteam,
        "schedulerId",
      ],
    },
    jobId: {
      propDefinition: [
        connecteam,
        "jobId",
      ],
    },
    assignedUserIds: {
      propDefinition: [
        connecteam,
        "assignedUserIds",
      ],
    },
    userType: {
      propDefinition: [
        connecteam,
        "userType",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  methods: {
    _getLastShiftCreationTime() {
      return this.db.get("lastShiftCreationTime") || 0;
    },
    _setLastShiftCreationTime(time) {
      this.db.set("lastShiftCreationTime", time);
    },
  },
  hooks: {
    async deploy() {
      const now = Math.floor(Date.now() / 1000);
      const startTime = now - 7 * 24 * 60 * 60; // 1 week ago
      const shifts = await this.connecteam._makeRequest({
        path: `/scheduler/v1/schedulers/${this.schedulerId}/shifts`,
        params: {
          startTime,
          endTime: now,
          limit: 50,
          sort: "creationTime",
          order: "desc",
        },
      });

      for (const shift of shifts) {
        this.$emit(shift, {
          id: shift.id,
          summary: `New Shift: ${shift.title}`,
          ts: shift.creationTime * 1000,
        });
      }

      if (shifts.length > 0) {
        this._setLastShiftCreationTime(shifts[0].creationTime);
      }
    },
  },
  async run() {
    const lastShiftCreationTime = this._getLastShiftCreationTime();
    const now = Math.floor(Date.now() / 1000);
    const shifts = await this.connecteam._makeRequest({
      path: `/scheduler/v1/schedulers/${this.schedulerId}/shifts`,
      params: {
        startTime: lastShiftCreationTime,
        endTime: now,
        sort: "creationTime",
        order: "asc",
      },
    });

    for (const shift of shifts) {
      this.$emit(shift, {
        id: shift.id,
        summary: `New Shift: ${shift.title}`,
        ts: shift.creationTime * 1000,
      });
    }

    if (shifts.length > 0) {
      this._setLastShiftCreationTime(shifts[shifts.length - 1].creationTime);
    }
  },
};
