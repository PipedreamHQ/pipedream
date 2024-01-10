import oyster from "../../oyster.app.mjs";

export default {
  key: "oyster-approved-time-off-request",
  name: "Approved Time Off Request",
  description: "Emits an event when a time off request is approved in Oyster",
  version: "0.0.{{ts}}",
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
    approvedStatus: {
      propDefinition: [
        oyster,
        "approvedStatus",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at, employeeName,
      } = data;
      return {
        id,
        summary: `Time off request approved for ${employeeName}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const since = this.db.get("since") || new Date().toISOString();
    const approvedRequests = await this.oyster.approveTimeOffRequest({
      employeeName: this.employeeName,
      requestDetails: this.requestDetails,
      approvedStatus: this.approvedStatus,
    });

    for (const request of approvedRequests) {
      if (new Date(request.created_at) > new Date(since)) {
        this.$emit(request, this.generateMeta(request));
      }
    }

    this.db.set("since", new Date().toISOString());
  },
};
