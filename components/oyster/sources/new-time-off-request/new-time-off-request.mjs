import oyster from "../../oyster.app.mjs";

export default {
  key: "oyster-new-time-off-request",
  name: "New Time Off Request",
  description: "Emits an event when a new time off request is made",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    oyster,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    employeeName: {
      propDefinition: [
        oyster,
        "employeeName",
      ],
    },
    requestDetails: {
      propDefinition: [
        oyster,
        "requestDetails",
      ],
    },
  },
  methods: {
    _getLastRequestTime() {
      return this.db.get("lastRequestTime");
    },
    _setLastRequestTime(time) {
      this.db.set("lastRequestTime", time);
    },
  },
  hooks: {
    async deploy() {
      // Get all existing requests on first run
      const existingRequests = await this.oyster.postNewTimeOffRequest({
        employeeName: this.employeeName,
        requestDetails: this.requestDetails,
      });
      if (Array.isArray(existingRequests)) {
        existingRequests.forEach((request) => {
          this.$emit(request, {
            id: request.id,
            summary: `New time off request for ${request.employeeName}`,
            ts: Date.parse(request.createdAt),
          });
        });
      }
    },
  },
  async run() {
    const lastRequestTime = this._getLastRequestTime();
    const timeOffRequests = await this.oyster.getRequests({
      employeeName: this.employeeName,
      requestDetails: this.requestDetails,
    });

    for (const request of timeOffRequests) {
      const createdTime = new Date(request.created_at).getTime();

      if (!lastRequestTime || createdTime > lastRequestTime) {
        this.$emit(request, {
          id: request.id,
          summary: `New Time Off Request: ${request.id}`,
          ts: createdTime,
        });
      }
    }

    this._setLastRequestTime(Date.now());
  },
};
