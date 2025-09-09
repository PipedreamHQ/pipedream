import {
  API_ENDPOINTS, SORT_ORDERS,
} from "../../common/constants.mjs";
import {
  createEventSummary, getEventTimestamp,
} from "../../common/utils.mjs";

export default {
  name: "New Employee Created",
  description: "Emit new event when a new employee is added to the system",
  key: "employeeCreated",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    buddee: {
      type: "app",
      app: "buddee",
      label: "Buddee",
      description: "The Buddee app instance to use",
    },
    db: {
      type: "$.service.db",
      label: "Database",
      description: "The database service to store state",
    },
  },
  methods: {
    _getLastEmployeeId() {
      return this.db.get("lastEmployeeId");
    },
    _setLastEmployeeId(employeeId) {
      this.db.set("lastEmployeeId", employeeId);
    },
  },
  async run({ $ }) {
    const lastEmployeeId = this._getLastEmployeeId();

    const params = {
      limit: 100,
      sort: "created_at",
      order: SORT_ORDERS.DESC,
    };

    if (lastEmployeeId) {
      params.since_id = lastEmployeeId;
    }

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.EMPLOYEES,
      params,
    });

    const employees = response.data;

    if (employees && employees.length > 0) {
      // Store the latest employee ID for next run
      this._setLastEmployeeId(employees[0].id);

      // Return only new employees (excluding the last one we already processed)
      const newEmployees = lastEmployeeId
        ? employees.filter((emp) => emp.id > lastEmployeeId)
        : employees;

      return newEmployees.map((employee) => ({
        id: employee.id,
        summary: createEventSummary("employee_created", employee),
        ts: getEventTimestamp(employee),
        data: employee,
      }));
    }

    return [];
  },
};
