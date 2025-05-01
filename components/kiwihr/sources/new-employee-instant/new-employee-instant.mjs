import kiwihr from "../../kiwihr.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kiwihr-new-employee-instant",
  name: "New Employee Instant",
  description: "Emit new event when a new employee is added to KiwiHR. [See the documentation](https://api.kiwihr.com/api/docs/)",
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
    department: {
      propDefinition: [
        kiwihr,
        "department",
      ],
    },
    location: {
      propDefinition: [
        kiwihr,
        "location",
      ],
    },
  },
  methods: {
    _getLastEmployeeAddedDate() {
      return this.db.get("lastEmployeeAddedDate") || null;
    },
    _setLastEmployeeAddedDate(date) {
      this.db.set("lastEmployeeAddedDate", date);
    },
  },
  hooks: {
    async deploy() {
      const params = {
        departmentId: this.department,
        locationId: this.location,
        limit: 50,
        sort: [
          {
            field: "createdAt",
            direction: "desc",
          },
        ],
      };
      const employees = await this.kiwihr.getEmployees({
        params,
      });

      for (const employee of employees.reverse()) {
        const event = {
          id: employee.id,
          summary: `New employee: ${employee.firstName} ${employee.lastName}`,
          ts: Date.parse(employee.createdAt),
        };
        this.$emit(employee, event);
      }

      if (employees.length > 0) {
        const latestEmployee = employees[0];
        this._setLastEmployeeAddedDate(latestEmployee.createdAt);
      }
    },
    async activate() {
      // Hook to create a webhook subscription if supported
    },
    async deactivate() {
      // Hook to delete a webhook subscription if created
    },
  },
  async run(event) {
    const {
      department, location,
    } = this;
    await this.kiwihr.onEmployeeAdded({
      department,
      location,
    });

    const latestDate = this._getLastEmployeeAddedDate();
    const employees = await this.kiwihr.getEmployees({
      params: {
        departmentId: department,
        locationId: location,
        createdSince: latestDate,
      },
    });

    for (const employee of employees) {
      const event = {
        id: employee.id,
        summary: `New employee: ${employee.firstName} ${employee.lastName}`,
        ts: Date.parse(employee.createdAt),
      };
      this.$emit(employee, event);
    }

    if (employees.length > 0) {
      const latestEmployee = employees[0];
      this._setLastEmployeeAddedDate(latestEmployee.createdAt);
    }
  },
};
