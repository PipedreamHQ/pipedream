import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-catalog-item",
  name: "Get Catalog Item",
  description: "Fetch full detail for a Service Catalog item, including the `variables` schema that defines its order form."
    + " **When to use:** always call this before **Order Catalog Item** or **Submit Record Producer** — you need the `variables` schema to know which fields are required, what types they accept, and what choice values are valid."
    + " **Returns:** the catalog item plus a `variables` array. Each variable has `name` (use this as the key when submitting), `label`, `type` (`single_line_text`, `reference`, `select_box`, `list_collector`, `multi_line_text`, `checkbox`, `boolean`, `date`, `macro`, etc.), `mandatory`, `reference` (referenced table for reference vars), `ref_qualifier` (filter on the referenced table), `choices` (for select_box), and `children` (nested variable sets)."
    + " **Cross-references:** get the `sys_id` from **List Catalog Items**. After reading the variables, call **Order Catalog Item** (for regular catalog items) or **Submit Record Producer** (for record producers)."
    + " **Common mistakes:** don't flatten or strip the `variables` structure — the nested/reference metadata is what lets you build a valid submission payload."
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
    sysId: {
      type: "string",
      label: "Catalog Item sys_id",
      description: "`sys_id` of the catalog item. Get this from **List Catalog Items**.",
    },
  },
  async run({ $ }) {
    const response = await axios($, {
      url: `${this.app.getBaseUrl()}/api/sn_sc/servicecatalog/items/${this.sysId}`,
      headers: this.app.getAuthHeaders(),
    });

    const item = response.result ?? {};
    const varCount = item.variables?.length ?? 0;
    $.export("$summary", `Retrieved catalog item "${item.name ?? this.sysId}" (${varCount} variables)`);

    return item;
  },
};
