import drata from "../../drata.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/PersonnelPublicController_listPersonnel/";

export default {
  key: "drata-terminated-employee",
  name: "Employee Terminated",
  description: `Emit a new event when an employee is terminated. [See the documentation](${docsLink}).`,
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    drata,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const { data: lastCurrentEmployees } = await this.drata.listPersonnel({
        paginate: true,
        params: {
          sort: constants.SORT_CRITERIA.START_DATE, // this endpoint does not support sorting by creation date
          employmentStatuses: [
            "CURRENT_EMPLOYEE",
            "CURRENT_CONTRACTOR",
          ],
        },
      });

      this._setLastCurrentEmployees(lastCurrentEmployees.map((personnel) => personnel.id));

      const response = await this.drata.listPersonnel({
        params: {
          limit: constants.DEPLOY_LIMIT,
          sort: constants.SORT_CRITERIA.SEPARATION_DATE,
          sortDir: "DESC",
          employmentStatuses: [
            "FORMER_EMPLOYEE",
            "FORMER_CONTRACTOR",
            "SPECIAL_FORMER_EMPLOYEE",
            "SPECIAL_FORMER_CONTRACTOR",
          ],
        },
      });

      for (const personnel of response.data.reverse()) {
        this.$emit(personnel, {
          id: personnel.id,
          summary: `Historical terminated employee added event: ${this.drata.getPersonnelName(personnel)}`,
          ts: personnel.updatedAt,
        });
      }
    },
  },
  methods: {
    _getLastCurrentEmployees() {
      return new Set(this.db.get("lastCurrentEmployees"));
    },
    _setLastCurrentEmployees(lastCurrentEmployees) {
      this.db.set("lastCurrentEmployees", Array.from(lastCurrentEmployees));
    },
    getDifference(setA, setB) {
      return new Set(
        Array.from(setA).filter((element) => !setB.has(element)),
      );
    },
    async getTerminatedEmployees(terminatedEmployees) {
      if (!Array.isArray(terminatedEmployees)) {
        terminatedEmployees = Array.from(terminatedEmployees);
      }
      const employees = await Promise.all(
        terminatedEmployees.map((id) => this.drata.getPersonnelById({
          id,
        })),
      );
      return employees.filter(({ employmentStatus }) => employmentStatus.includes("FORMER"));
    },
    addNewEmployees(newEmployees, lastCurrentEmployees) {
      newEmployees.forEach((id) => lastCurrentEmployees.add(id));
    },
  },
  async run() {
    const lastCurrentEmployees = this._getLastCurrentEmployees();

    const response = await this.drata.listPersonnel({
      paginate: true,
      params: {
        limit: constants.PAGINATION_LIMIT,
        sort: constants.SORT_CRITERIA.START_DATE,
        employmentStatuses: [
          "CURRENT_EMPLOYEE",
          "CURRENT_CONTRACTOR",
        ],
      },
    });

    const currentEmployees = new Set(response.data.map((personnel) => personnel.id));
    const terminatedEmployees = this.getDifference(lastCurrentEmployees, currentEmployees);
    const newEmployees = this.getDifference(currentEmployees, lastCurrentEmployees);

    const terminated = await this.getTerminatedEmployees(Array.from(terminatedEmployees));
    for (const employee of terminated) {
      lastCurrentEmployees.delete(employee.id);
      this.$emit(employee, {
        id: employee.id,
        summary: `Employee terminated: ${this.drata.getPersonnelName(employee)}`,
        ts: employee.updatedAt,
      });
    }

    this.addNewEmployees(newEmployees, lastCurrentEmployees);
    this._setLastCurrentEmployees(lastCurrentEmployees);
  },
};
