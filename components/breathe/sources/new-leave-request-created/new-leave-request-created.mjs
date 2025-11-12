import common from "../common/base.mjs";

export default {
  ...common,
  key: "breathe-new-leave-request-created",
  name: "New Leave Request Created",
  description: "Emit new event when a new employee leave request is created in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/employees/GET_version_employees_id_leave_requests_json)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    employeeIds: {
      propDefinition: [
        common.props.breathe,
        "employeeId",
      ],
      type: "string[]",
      label: "Employee IDs",
      description: "Return leave requests for the selected employees only. If no employees are selected, leave requests for all employees will be returned.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTsField() {
      return "created_at";
    },
    getResourceFn() {
      return this.breathe.listLeaveRequests;
    },
    getArgs(lastTs) {
      const args = {
        params: {
          startDate: lastTs,
        },
      };
      if (this.employeeIds?.length === 1) {
        args.params.employee_id = this.employeeIds[0];
      }
      return args;
    },
    getResourceKey() {
      return "leave_requests";
    },
    isRelevant(leaveRequest) {
      return !this.employeeIds?.length || this.employeeIds.includes(leaveRequest.employee.id);
    },
    generateMeta(leaveRequest) {
      return {
        id: leaveRequest.id,
        summary: `New Leave Request ID: ${leaveRequest.id}`,
        ts: Date.parse(leaveRequest.created_at),
      };
    },
  },
};
