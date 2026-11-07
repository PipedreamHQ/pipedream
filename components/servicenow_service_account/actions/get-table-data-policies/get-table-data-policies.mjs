import { assertSafeQueryValue } from "@pipedream/servicenow/common/utils.mjs";
import servicenow from "../../servicenow_service_account.app.mjs";
import {
  asRows, attachChildren, buildIdListQuery, groupByReference, withSysId,
} from "../../common/utils.mjs";

const DEFAULT_POLICY_FIELDS = [
  "sys_id",
  "short_description",
  "conditions",
  "active",
  "enforce_ui",
  "apply_import_set",
  "apply_soap",
];

export default {
  key: "servicenow_service_account-get-table-data-policies",
  name: "Get Table Data Policies",
  description: "Retrieve the data policies of a ServiceNow table (for example `incident`) from `sys_data_policy2`, each with its field rules from `sys_data_policy_rule` under `rules`: which fields are mandatory or read-only and under which `conditions`. Unlike UI policies, data policies apply to REST API writes, so a record that breaks one is rejected. Only policies defined directly on the table return, so for an extended table (for example `incident` extends `task`) query the parent table as well. Use this before **Create Table Record** or **Update Table Record**. Pair with **Get Table UI Policies** for the form-only rules. Returns up to `limit` rows (default 100); if exactly `limit` rows come back, call again with `offset` raised by `limit` to get the rest. Example: table `incident` returns each active incident data policy with `rules` such as `{\"field\": \"assignment_group\", \"mandatory\": \"true\"}` for a policy that requires an assignment group. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
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
      propDefinition: [
        servicenow,
        "includeInactive",
      ],
    },
    responseFields: {
      propDefinition: [
        servicenow,
        "responseFields",
      ],
      description: "Fields to return on each data policy. Defaults to `sys_id`, `short_description`, `conditions`, `active`, `enforce_ui`, `apply_import_set`, and `apply_soap`. The `rules` always return in full.",
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
      default: 100,
    },
    offset: {
      propDefinition: [
        servicenow,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.table, "Table");

    const activeFilter = this.includeInactive
      ? ""
      : "^active=true";
    const requestedFields = this.responseFields?.length
      ? this.responseFields
      : DEFAULT_POLICY_FIELDS;
    const policies = asRows(await this.servicenow.getTableRecords({
      $,
      table: "sys_data_policy2",
      params: {
        sysparm_query: `model_table=${this.table}${activeFilter}^ORDERBYsys_id`,
        sysparm_fields: withSysId(requestedFields).join(","),
        sysparm_exclude_reference_link: true,
        sysparm_limit: this.limit,
        sysparm_offset: this.offset,
      },
    }));

    let rulesByPolicy = new Map();
    if (policies.length) {
      const policyIds = policies.map((policy) => policy.sys_id);
      const rules = asRows(await this.servicenow.getTableRecords({
        $,
        table: "sys_data_policy_rule",
        params: {
          sysparm_query: buildIdListQuery("sys_data_policy", policyIds),
          sysparm_exclude_reference_link: true,
        },
      }));
      rulesByPolicy = groupByReference(rules, "sys_data_policy");
    }

    const result = attachChildren(policies, {
      requestedFields,
      childrenByParent: rulesByPolicy,
      childKey: "rules",
    });
    $.export("$summary", `Retrieved ${result.length} data policy(ies) for table ${this.table}`);

    return result;
  },
};
