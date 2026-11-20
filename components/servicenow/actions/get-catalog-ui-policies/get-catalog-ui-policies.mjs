import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

const { MAX_LIMIT } = constants;

// Policy actions are looked up a few policies at a time: one `ui_policyIN`
// query with every id can make the request URL too long (HTTP 414).
const POLICY_LOOKUP_BATCH_SIZE = 10;
// At most this many batch lookups run at once, so a large item doesn't send
// a burst of requests the instance may throttle.
const POLICY_LOOKUP_CONCURRENCY = 3;

// Reads every page of a Table API query. Callers order by `sys_id` (after any
// other order) so the pages don't overlap or skip rows.
async function readAllPages(readPage) {
  const rows = [];
  for (let offset = 0; ; offset += MAX_LIMIT) {
    const page = await readPage({
      sysparm_limit: MAX_LIMIT,
      sysparm_offset: offset,
    });
    const pageRows = Array.isArray(page)
      ? page
      : [];
    rows.push(...pageRows);
    if (pageRows.length < MAX_LIMIT) {
      return rows;
    }
  }
}

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
  description: "Retrieve catalog UI policy actions for a ServiceNow catalog item from `catalog_ui_policy_action` (visibility, mandatory, and read-only rules), including the policies of the variable sets the item uses. Each action includes its parent `catalog_ui_policy` record, including `catalog_conditions`; a policy from a variable set has `variable_set` set instead of `catalog_item`. If the item's variable sets can't be read, it returns the item's own policies and the summary says variable-set policies were not checked. Run **Search Catalog Items** first to obtain the item `sys_id`. Use with **Get Catalog Item Variables** when building a form, then **Add Item to Cart** or **Checkout Order Guide**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
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

    // If the variable sets can't be read (for example an ACL on `io_set_item`),
    // still return the item's own policies and say so in the summary.
    let links = [];
    let variableSetError = null;
    try {
      links = await readAllPages((page) => this.servicenow.getCatalogItemVariableSets({
        $,
        params: {
          sysparm_query: `sc_cat_item=${this.catalogItemSysId}^ORDERBYsys_id`,
          sysparm_fields: "variable_set",
          ...page,
        },
      }));
    } catch (error) {
      variableSetError = error;
    }
    const variableSetIds = [
      ...new Set(links.map((link) => referenceId(link.variable_set)).filter(Boolean)),
    ];
    assertSafeIds(variableSetIds, "Variable set sys_id");

    // Filter the policies, not the actions: `catalog_item` and `variable_set`
    // exist only on `catalog_ui_policy`, and ServiceNow silently drops an
    // action query that dot-walks to them, returning every action on the instance.
    const owner = variableSetIds.length
      ? `catalog_item=${this.catalogItemSysId}^ORvariable_setIN${variableSetIds.join(",")}`
      : `catalog_item=${this.catalogItemSysId}`;
    const policies = await readAllPages((page) => this.servicenow.getCatalogUiPolicies({
      $,
      params: {
        sysparm_query: `active=true^${owner}^ORDERBYorder^ORDERBYsys_id`,
        ...page,
      },
    }));
    const policyIds = [
      ...new Set(policies.map((policy) => String(policy.sys_id ?? "").trim()).filter(Boolean)),
    ];
    assertSafeIds(policyIds, "UI policy sys_id");

    const batches = [];
    for (let i = 0; i < policyIds.length; i += POLICY_LOOKUP_BATCH_SIZE) {
      batches.push(policyIds.slice(i, i + POLICY_LOOKUP_BATCH_SIZE));
    }
    // Batches follow policy order, so once `limit` rows are in hand the later
    // batches can't change the first `limit` rows and are skipped.
    const actions = [];
    let skippedBatches = 0;
    for (let i = 0; i < batches.length; i += POLICY_LOOKUP_CONCURRENCY) {
      if (this.limit && actions.length >= this.limit) {
        skippedBatches = batches.length - i;
        break;
      }
      const group = batches.slice(i, i + POLICY_LOOKUP_CONCURRENCY);
      const groupRows = await Promise.all(group.map((batch) => (
        readAllPages((page) => this.servicenow.getCatalogUiPolicyActions({
          $,
          params: {
            sysparm_query: `ui_policyIN${batch.join(",")}^ORDERBYsys_id`,
            ...page,
          },
        }))
      )));
      actions.push(...groupRows.flat());
    }
    const policyById = new Map(policies.map((policy) => [
      policy.sys_id,
      policy,
    ]));
    const order = new Map(policyIds.map((policyId, index) => [
      policyId,
      index,
    ]));
    const policyOrder = (row) => order.get(referenceId(row.ui_policy)) ?? 0;
    const enriched = actions
      .map((row) => ({
        ...row,
        catalog_ui_policy: policyById.get(referenceId(row.ui_policy)) ?? null,
      }))
      .sort((a, b) => policyOrder(a) - policyOrder(b))
      .slice(0, this.limit || undefined);
    const fromSets = variableSetIds.length
      ? ` (item and ${variableSetIds.length} variable set(s))`
      : "";
    const notes = [];
    if (variableSetError) {
      notes.push(` Variable-set policies were not checked because the item's variable sets could not be read (${variableSetError.message ?? variableSetError}), so policies from variable sets may be missing.`);
    }
    if (skippedBatches) {
      notes.push(` Stopped at the limit of ${this.limit} row(s); later policies were not read.`);
    }
    $.export("$summary", `Retrieved ${enriched.length} catalog UI policy action(s) from ${policyIds.length} policies for ${this.catalogItemSysId}${fromSets}.${notes.join("")}`);

    return enriched;
  },
};
