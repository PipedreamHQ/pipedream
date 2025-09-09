import {
  API_ENDPOINTS, SORT_ORDERS,
} from "../../common/constants.mjs";
import {
  createEventSummary, getEventTimestamp,
} from "../../common/utils.mjs";

export default {
  name: "New Employee Updated",
  description: "Emit new event when employee information is modified",
  key: "employeeUpdated",
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
    _getLastUpdateTime() {
      return this.db.get("lastEmployeeUpdateTime");
    },
    _setLastUpdateTime(timestamp) {
      this.db.set("lastEmployeeUpdateTime", timestamp);
    },
  },
  async run({ $ }) {
    const lastUpdateTime = this._getLastUpdateTime();
    const currentTime = new Date().toISOString();

    const params = {
      limit: 100,
      sort: "updated_at",
      order: SORT_ORDERS.DESC,
    };

    if (lastUpdateTime) {
      params.updated_since = lastUpdateTime;
    }

    const response = await this.buddee._makeRequest({
      $,
      path: API_ENDPOINTS.EMPLOYEES,
      params,
    });

    const employees = response.data;

    if (employees && employees.length > 0) {
      // Store the current time for next run
      this._setLastUpdateTime(currentTime);

      // Filter out employees that were only created (not updated)
      const updatedEmployees = employees.filter((emp) =>
        emp.updated_at && emp.created_at &&
        new Date(emp.updated_at) > new Date(emp.created_at));

      return updatedEmployees.map((employee) => ({
        id: `${employee.id}-${employee.updated_at}`,
        summary: createEventSummary("employee_updated", employee),
        ts: getEventTimestamp(employee, "updated_at"),
        data: employee,
      }));
    }

    return [];
  },
};
