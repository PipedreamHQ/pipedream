import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-search-configuration-items",
  name: "Search Configuration Items",
  description: "Search ServiceNow CMDB configuration items in `cmdb_ci` by name. Use this for assigned-asset lookup after **Find Users** (pass that user's `sys_id` as **Assigned To**). Then read a specific CI with **Get Table Record By ID**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "Partial match against the CI `name` field. Example: `MacBook`.",
      optional: true,
    },
    sysClassName: {
      type: "string",
      label: "Class Name",
      description: "Optional `sys_class_name` filter. Example: `cmdb_ci_computer`.",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Optional `sys_id` of the assigned user (matched against `assigned_to`). Run **Find Users** to find it. Example: `46d44a23a9fe19810012d100cca80666`.",
      optional: true,
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
    assertSafeQueryValue(this.sysClassName, "Class Name");
    assertSafeQueryValue(this.assignedTo, "Assigned To");

    const queryParts = [];
    if (this.searchValue) {
      queryParts.push(`nameLIKE${this.searchValue}`);
    }
    if (this.sysClassName) {
      queryParts.push(`sys_class_name=${this.sysClassName}`);
    }
    if (this.assignedTo) {
      queryParts.push(`assigned_to=${this.assignedTo}`);
    }
    if (!queryParts.length) {
      throw new ConfigurationError("Provide a Search Value, Class Name, or Assigned To.");
    }

    const response = await this.servicenow.listConfigurationItems({
      $,
      params: {
        sysparm_query: queryParts.join("^"),
        sysparm_limit: this.limit,
      },
    });

    const items = Array.isArray(response)
      ? response
      : [];
    const label = this.searchValue
      ? `"${this.searchValue}"`
      : "the given filters";
    $.export("$summary", `Found ${items.length} configuration item(s) matching ${label}`);

    return response;
  },
};
