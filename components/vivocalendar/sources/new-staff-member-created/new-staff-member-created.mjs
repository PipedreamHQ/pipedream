import common from "../common/polling.mjs";

export default {
  ...common,
  key: "vivocalendar-new-staff-member-created",
  name: "New Staff Member Created",
  description: "Emit new event when a new staff member is created in VIVO Calendar. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "response.staff_members";
    },
    getResourcesFn() {
      return this.app.listStaffUsers;
    },
    getResourcesFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Member: ${resource.email}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
