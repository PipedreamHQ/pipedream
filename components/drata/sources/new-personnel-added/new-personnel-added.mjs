import drata from "../../drata.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/PersonnelPublicController_listPersonnel/";

export default {
  key: "drata-new-personnel-added",
  name: "New Personnel Added",
  description: `Emit a new event for every new personnel. [See the documentation](${docsLink}).`,
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
    currentlyEmployed: {
      type: "boolean",
      label: "Currently Employed",
      description: "Only emit events for current employees",
      optional: true,
    },
    currentlyContracted: {
      type: "boolean",
      label: "Currently Contracted",
      description: "Only emit events for current contractors",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const response = await this.drata.listPersonnel({
        paginate: true,
        params: {
          sort: constants.SORT_CRITERIA.START_DATE, // this endpoint does not support sorting by creation date
          employmentStatuses: this.getEmploymentStatuses(),
        },
      });

      this._setVisitedIds(response.data.map((personnel) => personnel.id));

      const historical = this.sortByCreation(response.data)
        .slice(-constants.DEPLOY_LIMIT)
        .reverse();

      for (const personnel of historical) {
        this.$emit(personnel, {
          id: personnel.id,
          summary: `Historical personnel added event: ${this.drata.getPersonnelName(personnel)}`,
          ts: personnel.createdAt,
        });
      }
    },
  },
  methods: {
    _getVisitedIds() {
      return new Set(this.db.get("visitedIds"));
    },
    _setVisitedIds(visitedIds) {
      this.db.set("visitedIds", Array.from(visitedIds));
    },
    sortByCreation(list) {
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    getEmploymentStatuses() {
      if (!this.currentlyEmployed && !this.currentlyContracted) {
        return undefined;
      }

      const employmentStatuses = [];
      if (this.currentlyEmployed) {
        employmentStatuses.push("CURRENT_EMPLOYEE");
      }
      if (this.currentlyContracted) {
        employmentStatuses.push("CURRENT_CONTRACTOR");
      }
      return employmentStatuses;
    },
  },
  async run() {
    const visitedIds = this._getVisitedIds();

    const response = await this.drata.listPersonnel({
      paginate: true,
      params: {
        limit: constants.PAGINATION_LIMIT,
        sort: constants.SORT_CRITERIA.START_DATE,
        employmentStatuses: this.getEmploymentStatuses(),
      },
    });

    for (const personnel of this.sortByCreation(response.data)) {
      if (!visitedIds.has(personnel.id)) {
        visitedIds.add(personnel.id);
        this.$emit(personnel, {
          id: personnel.id,
          summary: `New personnel added: ${this.drata.getPersonnelName(personnel)}`,
          ts: personnel.createdAt,
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },
};
