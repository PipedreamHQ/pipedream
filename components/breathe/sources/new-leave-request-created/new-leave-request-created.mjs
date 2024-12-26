import common from "../common/base.mjs";

export default {
  ...common,
  key: "breathe-new-leave-request-created",
  name: "New Leave Request Created",
  description: "Emit new event when a new employee leave request is created in Breathe. [See the documentation](https://developer.breathehr.com/examples#!/employees/GET_version_employees_id_leave_requests_json)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    employeeId: {
      propDefinition: [
        common.props.breathe,
        "employeeId",
      ],
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
      return {
        params: {
          employee_id: this.employeeId,
          startDate: lastTs,
        },
      };
    },
    getResourceKey() {
      return "leave_requests";
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
