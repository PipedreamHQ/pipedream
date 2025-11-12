import common from "../common/base.mjs";

export default {
  ...common,
  key: "charthop-new-employee-created",
  name: "New Employee Created",
  description: "Emit new event when a new employee is added to the organization. [See the documentation](https://api.charthop.com/swagger#/person/findPersons)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.charthop.listPersons;
    },
    getArgs() {
      return {
        orgId: this.orgId,
        params: {
          includeAll: true,
        },
      };
    },
    getSummary(item) {
      return `New Employee: ${item.id}`;
    },
  },
};
