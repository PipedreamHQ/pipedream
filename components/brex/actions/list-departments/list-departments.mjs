import brexApp from "../../brex.app.mjs";
import { formatSearchSummary } from "../../common/utils.mjs";

export default {
  key: "brex-list-departments",
  name: "List Departments",
  description: "Lists the departments configured in the Brex account with their ID and name. Results are capped at `maxResults` (default `100`) — check `$summary` for a truncation notice and raise `maxResults` if it's truncated. This is how you turn a department name into the department ID that **Invite User** requires. [See the documentation](https://developer.brex.com/openapi/team_api/departments/listdepartments)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    maxResults: {
      propDefinition: [
        brexApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await this.brexApp.listDepartmentsPaginated({
      $,
      max: this.maxResults,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: "department(s)",
      truncated,
    }));

    return items;
  },
};
