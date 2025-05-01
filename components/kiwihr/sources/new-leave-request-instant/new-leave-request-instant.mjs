import kiwihr from "../../kiwihr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kiwihr-new-leave-request-instant",
  name: "New Leave Request Created",
  description: "Emit new event when a leave request is created or submitted by an employee. [See the documentation](https://api.kiwihr.com/api/docs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kiwihr: {
      type: "app",
      app: "kiwihr",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    leaveType: {
      propDefinition: [
        kiwihr,
        "leaveType",
      ],
    },
    requestStatus: {
      propDefinition: [
        kiwihr,
        "requestStatus",
      ],
    },
  },
  hooks: {
    async deploy() {
      const leaveRequests = await this.kiwihr.onLeaveRequestCreated({
        leaveType: this.leaveType,
        requestStatus: this.requestStatus,
      });
      leaveRequests.slice(-50).forEach((request) => {
        this.$emit(request, {
          id: request.id,
          summary: `New leave request from ${request.employeeName}`,
          ts: new Date(request.createdDate).getTime(),
        });
      });
    },
    async activate() {
      // This source does not require creating webhooks via an API request
    },
    async deactivate() {
      // This source does not require deleting webhooks via an API request
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New leave request from ${body.employeeName}`,
      ts: new Date(body.createdDate).getTime(),
    });
  },
};
