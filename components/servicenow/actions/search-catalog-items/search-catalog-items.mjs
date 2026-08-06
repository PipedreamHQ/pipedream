import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-search-catalog-items",
  name: "Search Catalog Items",
  description: "Search the ServiceNow Service Catalog for orderable items. Use this first to discover catalog item `sys_id` values needed by **Get Catalog Item Variables**, **Add Item to Cart**, **Order Catalog Item**, and **Submit Record Producer**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    query: {
      type: "string",
      label: "Query",
      description: "Free-text search term to match catalog items (maps to `sysparm_text`). Example: `laptop`.",
      optional: true,
    },
    catalogSysId: {
      type: "string",
      label: "Catalog Sys ID",
      description: "Optional catalog `sys_id` to restrict results to a single catalog. Find it via **Get Table Records** on the `sc_catalog` table. Example: `e0d08b13c3330100c8b837659bba8fb4`.",
      optional: true,
    },
    categorySysId: {
      type: "string",
      label: "Category Sys ID",
      description: "Optional category `sys_id` to restrict results to a single category. Find it via **Get Table Records** on the `sc_category` table. Example: `d258b953c611227a0146101fb1be7c31`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of items to skip for pagination (maps to `sysparm_offset`).",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.searchCatalogItems({
      $,
      params: {
        sysparm_text: this.query,
        sysparm_catalog: this.catalogSysId,
        sysparm_category: this.categorySysId,
        sysparm_limit: this.limit,
        sysparm_offset: this.offset,
      },
    });

    const items = Array.isArray(response)
      ? response
      : (response?.items ?? []);
    $.export("$summary", `Successfully retrieved ${items.length} catalog item(s)`);

    return response;
  },
};
