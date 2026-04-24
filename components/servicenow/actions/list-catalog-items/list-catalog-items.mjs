import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-list-catalog-items",
  name: "List Catalog Items",
  description: "Browse or search the ServiceNow Service Catalog. Returns orderable catalog items (laptops, software access, VPN requests, HR forms, etc.) and record producers."
    + " **When to use:** any intent that involves ordering, requesting, or submitting a form through the Service Catalog (\"order a laptop\", \"request VPN access\", \"submit a new-hire request\")."
    + " **Returns:** array of items with `sys_id`, `name`, `short_description`, `description`, `category`, `type` (`catalog_item` or `record_producer`), `price`, and `picture`."
    + " **Cross-references:** call **Get Catalog Item** on a returned `sys_id` next to see the form's variable schema. Then call **Order Catalog Item** (for `catalog_item`) or **Submit Record Producer** (for `record_producer`) to submit."
    + " **Common mistakes:** this is NOT the Table API — don't pass it an encoded query string. The `query` param is a free-text search, not `sysparm_query` syntax."
    + " [See the documentation](https://docs.servicenow.com/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Search",
      description: "Free-text search across catalog item names and descriptions (e.g. `laptop`, `vpn`). Omit to return all items.",
      optional: true,
    },
    catalog: {
      type: "string",
      label: "Catalog sys_id",
      description: "Limit results to a specific catalog by its `sys_id`. Omit to search across all catalogs.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category sys_id",
      description: "Limit results to a specific category by its `sys_id`. Omit to search all categories.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of items to return (default 20).",
      min: 1,
      max: 100,
      default: 20,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of items to skip (for pagination).",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      sysparm_limit: this.limit ?? 20,
      sysparm_offset: this.offset ?? 0,
    };
    if (this.query) params.sysparm_text = this.query;
    if (this.catalog) params.sysparm_catalog = this.catalog;
    if (this.category) params.sysparm_category = this.category;

    const response = await axios($, {
      url: `${this.app.getBaseUrl()}/api/sn_sc/servicecatalog/items`,
      headers: this.app.getAuthHeaders(),
      params,
    });

    const items = response.result ?? [];
    $.export("$summary", `Found ${items.length} catalog item(s)`);

    return items;
  },
};
