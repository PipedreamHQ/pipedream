import {
  API_ENDPOINTS, SORT_ORDERS,
} from "../../common/constants.mjs";
import {
  createEventSummary, getEventTimestamp,
} from "../../common/utils.mjs";

export default {
  name: "New Leave Request Created",
  description: "Emit new event when an employee submits a leave request",
  key: "leaveRequestCreated",
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
    _getLastLeaveRequestId() {
      return this.db.get("lastLeaveRequestId");
    },
    _setLastLeaveRequestId(requestId) {
      this.db.set("lastLeaveRequestId", requestId);
    },
  },
  async run({ $ }) {
    const lastLeaveRequestId = this._getLastLeaveRequestId();

    const params = {
      limit: 100,
      sort: "created_at",
      order: SORT_ORDERS.DESC,
    };

    if (lastLeaveRequestId) {
      params.since_id = lastLeaveRequestId;
    }

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.LEAVE_REQUESTS,
      params,
    });

    const leaveRequests = response.data;

    if (leaveRequests && leaveRequests.length > 0) {
      // Store the latest leave request ID for next run
      this._setLastLeaveRequestId(leaveRequests[0].id);

      // Return only new leave requests (excluding the last one we already processed)
      const newLeaveRequests = lastLeaveRequestId
        ? leaveRequests.filter((req) => req.id > lastLeaveRequestId)
        : leaveRequests;

      return newLeaveRequests.map((request) => ({
        id: request.id,
        summary: createEventSummary("leave_request_created", request),
        ts: getEventTimestamp(request),
        data: request,
      }));
    }

    return [];
  },
};
