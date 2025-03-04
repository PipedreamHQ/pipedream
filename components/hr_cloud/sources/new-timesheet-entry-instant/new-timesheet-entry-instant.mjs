import common from "../common/base.mjs";

export default {
  ...common,
  key: "hr_cloud-new-timesheet-entry-instant",
  name: "New Timesheet Entry (Instant)",
  description: "Emit new event when an employee logs a new timesheet entry. [See the documentation](https://help.hrcloud.com/api/#/introduction#top)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.hrCloud,
        "projectId",
      ],
    },
    employeeId: {
      propDefinition: [
        common.props.hrCloud,
        "employeeId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return "timesheet_entry.created";
    },
    getMetadata() {
      const metadata = {};
      if (this.projectId) {
        metadata.project_id = this.projectId;
      }
      if (this.employeeId) {
        metadata.employee_id = this.employeeId;
      }
      return metadata;
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New Timesheet Entry: ${data.employee_name} - ${data.hours} hours`,
        ts: Date.parse(data.created_at),
      };
    },
  },
};
