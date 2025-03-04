import common from "../common/base.mjs";

export default {
  ...common,
  key: "hr_cloud-new-employee-instant",
  name: "New Employee (Instant)",
  description: "Emit new event when a new employee is added to the system. [See the documentation](https://help.hrcloud.com/api/#/introduction#top)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    departmentId: {
      propDefinition: [
        common.props.hrCloud,
        "departmentId",
      ],
    },
    jobTitle: {
      propDefinition: [
        common.props.hrCloud,
        "jobTitle",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return "employee.created";
    },
    getMetadata() {
      const metadata = {};
      if (this.departmentId) {
        metadata.department_id = this.departmentId;
      }
      if (this.jobTitle) {
        metadata.job_title = this.jobTitle;
      }
      return metadata;
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New Employee: ${data.first_name} ${data.last_name}`,
        ts: Date.parse(data.created_at),
      };
    },
  },
};
