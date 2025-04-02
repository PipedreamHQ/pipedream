import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-new-leave-request",
  name: "New Leave Request",
  description: "Emit new event when a new leave request is submitted by an employee. [See the documentation](https://developers.lucca.fr/api-reference/legacy/timmi-absences/leave-requests/list-leave-requests)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lucca,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    leaveType: {
      propDefinition: [
        lucca,
        "leaveType",
      ],
    },
    userId: {
      propDefinition: [
        lucca,
        "userId",
      ],
    },
  },
  methods: {
    _getLastChecked() {
      return this.db.get("lastChecked") || null;
    },
    _setLastChecked(timestamp) {
      this.db.set("lastChecked", timestamp);
    },
    async fetchLeaveRequests(params = {}) {
      return this.lucca.listLeaveRequests({
        params,
      });
    },
    emitEvent(leaveRequest) {
      this.$emit(leaveRequest, {
        id: leaveRequest.id,
        summary: `New Leave Request by ${leaveRequest.leavePeriod.ownerId}`,
        ts: new Date(leaveRequest.creationDate).getTime(),
      });
    },
  },
  hooks: {
    async deploy() {
      const params = {
        orderBy: "creationDate desc",
        ...(this.leaveType && {
          leaveTypeId: this.leaveType,
        }),
        ...(this.userId && {
          userId: this.userId,
        }),
      };
      const leaveRequests = await this.fetchLeaveRequests(params);

      leaveRequests.slice(0, 50).forEach((leaveRequest) => {
        this.emitEvent(leaveRequest);
      });

      if (leaveRequests.length > 0) {
        const lastChecked = new Date(leaveRequests[0].creationDate);
        this._setLastChecked(lastChecked.toISOString());
      }
    },
  },
  async run() {
    const lastChecked = this._getLastChecked();
    const params = {
      orderBy: "creationDate asc",
      ...(this.leaveType && {
        leaveTypeId: this.leaveType,
      }),
      ...(this.userId && {
        userId: this.userId,
      }),
      ...(lastChecked && {
        filter: `creationDate gt ${lastChecked}`,
      }),
    };

    const leaveRequests = await this.fetchLeaveRequests(params);

    leaveRequests.forEach((leaveRequest) => {
      this.emitEvent(leaveRequest);
    });

    if (leaveRequests.length > 0) {
      const lastProcessedDate = new Date(leaveRequests[leaveRequests.length - 1].creationDate);
      this._setLastChecked(lastProcessedDate.toISOString());
    }
  },
};
