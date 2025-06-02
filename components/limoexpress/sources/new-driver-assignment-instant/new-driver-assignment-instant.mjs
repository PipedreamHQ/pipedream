import limoexpress from "../../limoexpress.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "limoexpress-new-driver-assignment-instant",
  name: "New Driver Assignment Instant",
  description: "Emit new event when a driver is assigned to a limo ride. Useful for dispatch coordination. [See the documentation](https://api.limoexpress.me/api/docs/v1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    limoexpress,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      this._setLastTimestamp(Date.now());
    },
    async activate() {
      // No activation logic needed
    },
    async deactivate() {
      // No deactivation logic needed
    },
  },
  methods: {
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    async fetchDriverAssignments() {
      const lastTimestamp = this._getLastTimestamp();
      const now = Date.now();

      const driverAssignments = await this.limoexpress._makeRequest({
        path: "/driver_assignments",
        params: {
          since: lastTimestamp,
        },
      });

      this._setLastTimestamp(now);
      return driverAssignments;
    },
  },
  async run() {
    const driverAssignments = await this.fetchDriverAssignments();

    for (const assignment of driverAssignments) {
      this.$emit(assignment, {
        id: assignment.id,
        summary: `Driver assigned to booking ID: ${assignment.bookingId}`,
        ts: assignment.timestamp
          ? Date.parse(assignment.timestamp)
          : Date.now(),
      });
    }
  },
};
