import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-catalog-item-variables",
  name: "Get Catalog Item Variables",
  description: "Retrieve the ordered variables (form fields) for a ServiceNow catalog item. Run **Search Catalog Items** first to obtain the item `sys_id`, then use the returned variable names to build the `variables` payload for **Add Item to Cart**, **Order Catalog Item**, or **Submit Record Producer**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
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
  },
  async run({ $ }) {
    const response = await this.servicenow.getCatalogItemVariables({
      $,
      catalogItemSysId: this.catalogItemSysId,
    });

    const variables = Array.isArray(response)
      ? response
      : (response?.variables ?? []);
    $.export("$summary", `Successfully retrieved ${variables.length} variable(s) for catalog item ${this.catalogItemSysId}`);

    return variables;
  },
};
