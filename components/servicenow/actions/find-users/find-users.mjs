import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-find-users",
  name: "Find Users",
  description: "Search ServiceNow `sys_user` records to find a user's `sys_id` (used by props like the requested-for field on **Add Item to Cart**). Choose whether to match on name (partial) or email (exact). [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    searchField: {
      type: "string",
      label: "Search Field",
      description: "Which `sys_user` field to match on. `Name` performs a partial (contains) match; `Email` requires an exact match.",
      options: [
        {
          label: "Name (partial match)",
          value: "name",
        },
        {
          label: "Email (exact match)",
          value: "email",
        },
      ],
      default: "name",
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "The value to search for. Example: `Jane Doe` or `jane.doe@example.com`.",
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.searchValue, "Search Value");

    const operator = this.searchField === "name"
      ? "LIKE"
      : "=";
    const response = await this.servicenow.listUsers({
      $,
      params: {
        sysparm_query: `${this.searchField}${operator}${this.searchValue}`,
        sysparm_limit: this.limit,
      },
    });

    const users = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Found ${users.length} user(s) matching ${this.searchField} "${this.searchValue}"`);

    return response;
  },
};
