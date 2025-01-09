import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import motive from "../../motive.app.mjs";

export default {
  key: "motive-new-hours-of-service-violation",
  name: "New Hours of Service Violation",
  description: "Emit a new event when a driver commits a violation related to hours of service (HOS). [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    motive,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    driverId: {
      propDefinition: [
        motive,
        "driverId",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const initialViolations = await this.motive.listHosViolations({
        driverId: this.driverId,
        perpage: 50,
        page: 1,
      });
      const sortedViolations = initialViolations.sort(
        (a, b) => new Date(b.created) - new Date(a.created),
      );
      const recentViolations = sortedViolations.slice(-50);
      for (const violation of recentViolations.reverse()) {
        const violationTs = violation.created
          ? Date.parse(violation.created)
          : Date.now();
        this.$emit(
          violation,
          {
            id: violation.id || violationTs,
            summary: `New HOS Violation for Driver ID: ${violation.driver_id}`,
            ts: violationTs,
          },
        );
      }
      if (recentViolations.length > 0) {
        const latestTs = Date.parse(recentViolations[recentViolations.length - 1].created);
        await this.db.set("lastTs", latestTs);
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to remove for polling source
    },
  },
  async run() {
    const lastTs = await this.db.get("lastTs") || 0;
    const newViolations = await this.motive.listHosViolations({
      driverId: this.driverId,
      since: new Date(lastTs).toISOString(),
      perpage: 50,
      page: 1,
    });
    for (const violation of newViolations) {
      const violationTs = violation.created
        ? Date.parse(violation.created)
        : Date.now();
      this.$emit(
        violation,
        {
          id: violation.id || violationTs,
          summary: `New HOS Violation for Driver ID: ${violation.driver_id}`,
          ts: violationTs,
        },
      );
      if (violationTs > lastTs) {
        await this.db.set("lastTs", violationTs);
      }
    }
  },
};
