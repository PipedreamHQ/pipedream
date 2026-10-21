import { assertSafeQueryValue } from "@pipedream/servicenow/common/utils.mjs";
import servicenow from "../../servicenow_service_account.app.mjs";
import {
  asRows, buildIdListQuery, groupByReference,
} from "../../common/utils.mjs";

const DEFAULT_POLICY_FIELDS = [
  "sys_id",
  "short_description",
  "conditions",
  "active",
  "order",
  "on_load",
  "reverse_if_false",
  "global",
  "run_scripts",
  "view",
];

export default {
  key: "servicenow_service_account-get-table-ui-policies",
  name: "Get Table UI Policies",
  description: "Retrieve the form UI policies of a ServiceNow table (for example `incident`) from `sys_ui_policy`, each with its field rules from `sys_ui_policy_action` under `actions`: which fields become visible, mandatory, read-only, or cleared and under which `conditions`. Use this before **Create Table Record** or **Update Table Record** to learn which fields a form requires or hides. For catalog items use **Get Catalog UI Policies** instead. Pair with **Get Table Data Policies**, which the server enforces on API writes. Returns up to `limit` rows (default 100); if exactly `limit` rows come back, call again with `offset` raised by `limit` to get the rest. Example: table `incident` returns each active incident UI policy with `actions` such as `{\"field\": \"close_notes\", \"mandatory\": \"true\"}` for the rule that requires close notes. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    table: {
      propDefinition: [
        servicenow,
        "table",
      ],
    },
    includeInactive: {
      type: "boolean",
      label: "Include Inactive",
      description: "If true, also return inactive UI policies. Defaults to active policies only.",
      optional: true,
    },
    responseFields: {
      propDefinition: [
        servicenow,
        "responseFields",
      ],
      description: "Fields to return on each UI policy. Defaults to `sys_id`, `short_description`, `conditions`, `active`, `order`, `on_load`, `reverse_if_false`, `global`, `run_scripts`, and `view`. The `actions` rules always return in full.",
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
      default: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of rows to skip for pagination (maps to `sysparm_offset`).",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.table, "Table");

    const activeFilter = this.includeInactive
      ? ""
      : "^active=true";
    const policies = asRows(await this.servicenow.getTableRecords({
      $,
      table: "sys_ui_policy",
      params: {
        sysparm_query: `table=${this.table}${activeFilter}^ORDERBYorder^ORDERBYsys_id`,
        sysparm_fields: (this.responseFields?.length
          ? this.responseFields
          : DEFAULT_POLICY_FIELDS).join(","),
        sysparm_exclude_reference_link: true,
        sysparm_limit: this.limit,
        sysparm_offset: this.offset,
      },
    }));

    let actionsByPolicy = new Map();
    if (policies.length) {
      const policyIds = policies.map((policy) => policy.sys_id);
      const actions = asRows(await this.servicenow.getTableRecords({
        $,
        table: "sys_ui_policy_action",
        params: {
          sysparm_query: buildIdListQuery("ui_policy", policyIds),
          sysparm_exclude_reference_link: true,
        },
      }));
      actionsByPolicy = groupByReference(actions, "ui_policy");
    }

    const result = policies.map((policy) => ({
      ...policy,
      actions: actionsByPolicy.get(policy.sys_id) ?? [],
    }));
    $.export("$summary", `Retrieved ${result.length} UI policy(ies) for table ${this.table}`);

    return result;
  },
};
