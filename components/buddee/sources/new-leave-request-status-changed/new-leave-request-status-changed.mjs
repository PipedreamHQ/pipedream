import {
  API_ENDPOINTS,
  LEAVE_REQUEST_STATUS,
  SORT_ORDERS,
} from "../../common/constants.mjs";
import {
  createEventSummary, getEventTimestamp,
} from "../../common/utils.mjs";

export default {
  name: "New Leave Request Status Changed",
  description: "Emit new event when leave request status changes (approved/rejected)",
  key: "leaveRequestStatusChanged",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    buddee: {
      type: "app",
      app: "buddee",
      label: "Buddee",
      description: "The Buddee app instance to use",
    },
    db: {
      type: "$.service.db",
      label: "Database",
      description: "The database service to store state",
    },
  },
  methods: {
    _getLastStatusUpdateTime() {
      return this.db.get("lastLeaveRequestStatusUpdateTime");
    },
    _setLastStatusUpdateTime(timestamp) {
      this.db.set("lastLeaveRequestStatusUpdateTime", timestamp);
    },
  },
  async run({ $ }) {
    const lastStatusUpdateTime = this._getLastStatusUpdateTime();
    const currentTime = new Date().toISOString();

    const params = {
      limit: 100,
      sort: "updated_at",
      order: SORT_ORDERS.DESC,
    };

    if (lastStatusUpdateTime) {
      params.updated_since = lastStatusUpdateTime;
    }

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.LEAVE_REQUESTS,
      params,
    });

    const leaveRequests = response.data;

    if (leaveRequests && leaveRequests.length > 0) {
      // Store the current time for next run
      this._setLastStatusUpdateTime(currentTime);

      // Filter for leave requests that have status changes (approved/rejected)
      const statusChangedRequests = leaveRequests.filter((req) =>
        req.status && [
          LEAVE_REQUEST_STATUS.APPROVED,
          LEAVE_REQUEST_STATUS.REJECTED,
        ].includes(req.status) &&
        req.updated_at && req.created_at &&
        new Date(req.updated_at) > new Date(req.created_at));

      return statusChangedRequests.map((request) => ({
        id: `${request.id}-${request.updated_at}`,
        summary: createEventSummary("leave_request_status_changed", request),
        ts: getEventTimestamp(request, "updated_at"),
        data: request,
      }));
    }

    return [];
  },
};
