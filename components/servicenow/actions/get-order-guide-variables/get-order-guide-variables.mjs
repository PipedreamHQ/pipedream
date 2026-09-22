import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-order-guide-variables",
  name: "Get Order Guide Variables",
  description: "Retrieve the ordered variables (form fields) for a ServiceNow order guide. Run **Search Catalog Items** with **Item Type** = `Order Guide` first, then pass the guide `sys_id` here. Use the returned names in **Submit Order Guide**. For a regular catalog item, use **Get Catalog Item Variables** instead. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
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
        "guideSysId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.getCatalogItemVariables({
      $,
      catalogItemSysId: this.catalogItemSysId,
    });

    const variables = Array.isArray(response)
      ? response
      : (response?.variables ?? []);
    $.export("$summary", `Successfully retrieved ${variables.length} variable(s) for order guide ${this.catalogItemSysId}`);

    return response;
  },
};
