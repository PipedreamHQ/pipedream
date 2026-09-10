import bamboohr from "../../bamboohr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bamboohr-list-changed-employees",
  name: "List Changed Employees",
  description: "List employee IDs that changed since a given time (GET /employees/changed). Returns employeeId, change type, and last-changed timestamp per entry. [See the documentation](https://documentation.bamboohr.com/reference/get-changed-employee-ids)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    since: {
      type: "string",
      label: "Since",
      description: "ISO 8601 datetime; only changes at or after this time are returned, e.g. `2026-01-01T00:00:00Z`.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter by change type. One of `inserted`, `updated`, `deleted`, `all`.",
      options: constants.EMPLOYEE_CHANGE_TYPES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listChangedEmployees({
      $,
      params: {
        since: this.since,
        type: this.type,
      },
    });
    const count = Object.keys(response?.employees ?? {}).length;
    $.export("$summary", `Retrieved ${count} changed employee${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
