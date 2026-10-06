import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-catalog-item",
  name: "Get Catalog Item",
  description: "Retrieve details for a ServiceNow catalog item or record producer: name, short and full description, price and recurring price, catalogs and categories, item type, whether an attachment is mandatory, and its catalog UI policies and client scripts. Run **Search Catalog Items** first to obtain the item `sys_id`. To build the `variables` payload for **Add Item to Cart**, **Order Catalog Item**, or **Submit Record Producer**, use **Get Catalog Item Variables**, which returns each form field with its valid options. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
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
    includeVariables: {
      type: "boolean",
      label: "Include Variables",
      description: "Set to `true` to also return the raw `variables` array. Leave unset to omit it; **Get Catalog Item Variables** returns the same fields with option guidance.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    let item;
    try {
      item = await this.servicenow.getCatalogItem({
        $,
        catalogItemSysId: this.catalogItemSysId,
      });
    } catch (error) {
      if (error?.response?.status === 500) {
        throw new Error(`ServiceNow could not load the details of catalog item \`${this.catalogItemSysId}\` (HTTP 500). This happens for some record producers; run **Get Catalog Item Variables** to get its form fields.`, {
          cause: error,
        });
      }
      throw error;
    }

    const result = {
      ...item,
    };
    if (!this.includeVariables) {
      result.variable_count = Array.isArray(item?.variables)
        ? item.variables.length
        : 0;
      delete result.variables;
    }

    $.export("$summary", `Successfully retrieved catalog item ${result.name ?? this.catalogItemSysId}`);

    return result;
  },
};
