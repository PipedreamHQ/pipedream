import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

function referenceId(value) {
  if (value && typeof value === "object") {
    return String(value.value ?? "").trim();
  }
  return String(value ?? "").trim();
}

export default {
  key: "servicenow-get-catalog-ui-policies",
  name: "Get Catalog UI Policies",
  description: "Retrieve catalog UI policy actions for a ServiceNow catalog item from `catalog_ui_policy_action` (visibility, mandatory, and read-only rules). Each action includes its parent `catalog_ui_policy` record, including `catalog_conditions`. Run **Search Catalog Items** first to obtain the item `sys_id`. Use with **Get Catalog Item Variables** when building a form, then **Add Item to Cart** or **Checkout Order Guide**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
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
    catalogItemSysId: {
      propDefinition: [
        servicenow,
        "catalogItemSysId",
      ],
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.catalogItemSysId, "Catalog Item Sys ID");

    const response = await this.servicenow.getCatalogUiPolicyActions({
      $,
      params: {
        sysparm_query: `ui_policy.catalog_item=${this.catalogItemSysId}^ui_policy.active=true^ORDERBYui_policy.order`,
        sysparm_limit: this.limit,
      },
    });

    const rows = Array.isArray(response)
      ? response
      : [];
    const policyIds = [
      ...new Set(rows.map((row) => referenceId(row.ui_policy)).filter(Boolean)),
    ];
    for (const policyId of policyIds) {
      assertSafeQueryValue(policyId, "UI policy sys_id");
      if (policyId.includes(",")) {
        throw new ConfigurationError("UI policy sys_id cannot contain a comma.");
      }
    }

    let policies = [];
    if (policyIds.length) {
      const policyResponse = await this.servicenow.getCatalogUiPolicies({
        $,
        params: {
          sysparm_query: `sys_idIN${policyIds.join(",")}`,
          sysparm_limit: policyIds.length,
        },
      });
      policies = Array.isArray(policyResponse)
        ? policyResponse
        : [];
    }
    const policyById = new Map(policies.map((policy) => [
      policy.sys_id,
      policy,
    ]));
    const enriched = rows.map((row) => ({
      ...row,
      catalog_ui_policy: policyById.get(referenceId(row.ui_policy)) ?? null,
    }));
    $.export("$summary", `Retrieved ${enriched.length} catalog UI policy action(s) for ${this.catalogItemSysId}`);

    return enriched;
  },
};
