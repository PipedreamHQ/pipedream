import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-catalog-ui-policies",
  name: "Get Catalog UI Policies",
  description: "Retrieve catalog UI policy actions for a ServiceNow catalog item from `catalog_ui_policy_action` (visibility, mandatory, and read-only rules). Run **Search Catalog Items** first to obtain the item `sys_id`. Use with **Get Catalog Item Variables** when building a form, then **Add Item to Cart** or **Checkout Order Guide**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
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
    $.export("$summary", `Retrieved ${rows.length} catalog UI policy action(s) for ${this.catalogItemSysId}`);

    return response;
  },
};
