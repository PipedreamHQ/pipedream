import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

const { MAX_LIMIT } = constants;

// Policy actions are looked up a few policies at a time: one `ui_policyIN`
// query with every id can make the request URL too long (HTTP 414).
const POLICY_LOOKUP_BATCH_SIZE = 10;

function referenceId(value) {
  if (value && typeof value === "object") {
    return String(value.value ?? "").trim();
  }
  return String(value ?? "").trim();
}

function assertSafeIds(ids, label) {
  for (const id of ids) {
    assertSafeQueryValue(id, label);
    if (id.includes(",")) {
      throw new ConfigurationError(`${label} cannot contain a comma.`);
    }
  }
}

export default {
  key: "servicenow-get-catalog-ui-policies",
  name: "Get Catalog UI Policies",
  description: "Retrieve catalog UI policy actions for a ServiceNow catalog item from `catalog_ui_policy_action` (visibility, mandatory, and read-only rules), including the policies of the variable sets the item uses. Each action includes its parent `catalog_ui_policy` record, including `catalog_conditions`; a policy from a variable set has `variable_set` set instead of `catalog_item`. Run **Search Catalog Items** first to obtain the item `sys_id`. Use with **Get Catalog Item Variables** when building a form, then **Add Item to Cart** or **Checkout Order Guide**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
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

    const links = await this.servicenow.getCatalogItemVariableSets({
      $,
      params: {
        sysparm_query: `sc_cat_item=${this.catalogItemSysId}`,
        sysparm_fields: "variable_set",
      },
    });
    const variableSetIds = [
      ...new Set((Array.isArray(links)
        ? links
        : []).map((link) => referenceId(link.variable_set)).filter(Boolean)),
    ];
    assertSafeIds(variableSetIds, "Variable set sys_id");

    // Filter the policies, not the actions: `catalog_item` and `variable_set`
    // exist only on `catalog_ui_policy`, and ServiceNow silently drops an
    // action query that dot-walks to them, returning every action on the instance.
    const owner = variableSetIds.length
      ? `catalog_item=${this.catalogItemSysId}^ORvariable_setIN${variableSetIds.join(",")}`
      : `catalog_item=${this.catalogItemSysId}`;
    const policyResponse = await this.servicenow.getCatalogUiPolicies({
      $,
      params: {
        sysparm_query: `active=true^${owner}^ORDERBYorder`,
        sysparm_limit: MAX_LIMIT,
      },
    });
    const policies = Array.isArray(policyResponse)
      ? policyResponse
      : [];
    const policyIds = [
      ...new Set(policies.map((policy) => String(policy.sys_id ?? "").trim()).filter(Boolean)),
    ];
    assertSafeIds(policyIds, "UI policy sys_id");

    const batches = [];
    for (let i = 0; i < policyIds.length; i += POLICY_LOOKUP_BATCH_SIZE) {
      batches.push(policyIds.slice(i, i + POLICY_LOOKUP_BATCH_SIZE));
    }
    const actionResponses = await Promise.all(batches.map((batch) => this.servicenow.getCatalogUiPolicyActions({
      $,
      params: {
        sysparm_query: `ui_policyIN${batch.join(",")}`,
        sysparm_limit: MAX_LIMIT,
      },
    })));
    const policyById = new Map(policies.map((policy) => [
      policy.sys_id,
      policy,
    ]));
    const order = new Map(policyIds.map((policyId, index) => [
      policyId,
      index,
    ]));
    const enriched = actionResponses
      .flatMap((actionResponse) => (Array.isArray(actionResponse)
        ? actionResponse
        : []))
      .map((row) => ({
        ...row,
        catalog_ui_policy: policyById.get(referenceId(row.ui_policy)) ?? null,
      }))
      .sort((a, b) => (order.get(referenceId(a.ui_policy)) ?? 0) - (order.get(referenceId(b.ui_policy)) ?? 0))
      .slice(0, this.limit || undefined);
    const fromSets = variableSetIds.length
      ? ` (item and ${variableSetIds.length} variable set(s))`
      : "";
    $.export("$summary", `Retrieved ${enriched.length} catalog UI policy action(s) from ${policyIds.length} policies for ${this.catalogItemSysId}${fromSets}`);

    return enriched;
  },
};
