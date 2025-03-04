import common from "../common/base.mjs";

export default {
  ...common,
  key: "hr_cloud-new-leave-request-instant",
  name: "New Leave Request (Instant)",
  description: "Emit new event when an employee submits a leave request. [See the documentation](https://help.hrcloud.com/api/#/introduction#top)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    leaveType: {
      propDefinition: [
        common.props.hrCloud,
        "leaveType",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return "leave_request.created";
    },
    getMetadata() {
      const metadata = {};
      if (this.leaveType) {
        metadata.leave_type = this.leaveType;
      }
      return metadata;
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New Leave Request: ${data.employee_name} - ${data.leave_type}`,
        ts: Date.parse(data.created_at),
      };
    },
  },
};
