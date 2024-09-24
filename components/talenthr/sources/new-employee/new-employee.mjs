import talenthr from "../../talenthr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "talenthr-new-employee",
  name: "New Employee Created",
  description: "Emit new event whenever a new employee is created. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    talenthr,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // Poll every 10 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents();
    },
    async activate() {},
    async deactivate() {},
  },
  methods: {
    _getLastEmployeeId() {
      return this.db.get("lastEmployeeId");
    },
    _setLastEmployeeId(lastEmployeeId) {
      this.db.set("lastEmployeeId", lastEmployeeId);
    },
    async processEvents() {
      const lastEmployeeId = this._getLastEmployeeId();
      const params = lastEmployeeId
        ? {
          since_id: lastEmployeeId,
        }
        : {};
      const employees = await this.talenthr.listNewEmployees({
        params,
      });

      if (employees.length === 0) return;

      let newLastEmployeeId = lastEmployeeId || 0;
      for (const employee of employees.reverse()) {
        if (employee.id > newLastEmployeeId) {
          this.$emit(employee, {
            id: employee.id,
            summary: `New Employee: ${employee.name}`,
            ts: new Date(employee.createdAt).getTime(),
          });
          newLastEmployeeId = employee.id;
        }
      }
      this._setLastEmployeeId(newLastEmployeeId);
    },
  },
  async run() {
    await this.processEvents();
  },
};
