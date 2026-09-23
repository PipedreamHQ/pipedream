import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-submit-order-guide",
  name: "Submit Order Guide",
  description: "Run the ServiceNow order-guide rule base and return the selected catalog items plus their variable schemas. Run **Search Catalog Items** to find the order-guide `sys_id` and **Get Catalog Item Variables** for guide-level field names. Pass the returned items to **Checkout Order Guide**. If checkout does not return a REQ, the guide's Two step flag is off: review with **View Cart**, then call **Submit Cart Order**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    catalogItemSysId: {
      propDefinition: [
        servicenow,
        "guideSysId",
      ],
    },
    variables: {
      propDefinition: [
        servicenow,
        "variables",
      ],
      description: "JSON object of guide-level variable name-value pairs. Run **Get Catalog Item Variables** on the order guide to discover valid names. Example: `{\"primary_location\": \"abc123\"}`.",
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.submitOrderGuide({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        variables: parseObject(this.variables) ?? {},
      },
    });

    const items = response?.items ?? [];
    const count = Array.isArray(items)
      ? items.length
      : 0;
    $.export("$summary", `Successfully submitted order guide ${this.catalogItemSysId} - ${count} item(s)`);

    return response;
  },
};
