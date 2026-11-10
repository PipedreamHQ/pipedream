import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

const { MAX_LIMIT } = constants;
// 32-character sys_ids plus a comma: 100 per request keeps the URL far below ServiceNow's limit.
const POLICY_IDS_PER_REQUEST = 100;

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
  version: "0.0.6",
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

    // Policies are read by item first. `catalog_ui_policy_action.ui_policy` references the
    // base `sys_ui_policy` table, which has no `catalog_item`, so filtering actions on
    // `ui_policy.catalog_item` is an invalid condition that ServiceNow drops, returning
    // every action on the instance.
    const policyResponse = await this.servicenow.getCatalogUiPolicies({
      $,
      params: {
        sysparm_query: `catalog_item=${this.catalogItemSysId}^active=true^ORDERBYorder`,
        sysparm_limit: MAX_LIMIT,
      },
    });
    const policies = Array.isArray(policyResponse)
      ? policyResponse
      : [];
    const policyById = new Map();
    for (const policy of policies) {
      const policyId = referenceId(policy.sys_id);
      if (!policyId) {
        continue;
      }
      assertSafeQueryValue(policyId, "UI policy sys_id");
      if (policyId.includes(",")) {
        throw new ConfigurationError("UI policy sys_id cannot contain a comma.");
      }
      policyById.set(policyId, policy);
    }
    const policyIds = [
      ...policyById.keys(),
    ];

    const limit = this.limit ?? MAX_LIMIT;
    const rows = [];
    for (let start = 0; start < policyIds.length && rows.length < limit; start += POLICY_IDS_PER_REQUEST) {
      const chunk = policyIds.slice(start, start + POLICY_IDS_PER_REQUEST);
      const response = await this.servicenow.getCatalogUiPolicyActions({
        $,
        params: {
          sysparm_query: `ui_policyIN${chunk.join(",")}`,
          sysparm_limit: limit - rows.length,
        },
      });
      if (Array.isArray(response)) {
        rows.push(...response.filter((row) => policyById.has(referenceId(row.ui_policy))));
      }
    }

    const rank = new Map(policyIds.map((policyId, index) => [
      policyId,
      index,
    ]));
    const enriched = rows
      .sort((a, b) => rank.get(referenceId(a.ui_policy)) - rank.get(referenceId(b.ui_policy)))
      .map((row) => ({
        ...row,
        catalog_ui_policy: policyById.get(referenceId(row.ui_policy)),
      }));
    $.export("$summary", `Retrieved ${enriched.length} catalog UI policy action(s) for ${this.catalogItemSysId}`);

    return enriched;
  },
};
