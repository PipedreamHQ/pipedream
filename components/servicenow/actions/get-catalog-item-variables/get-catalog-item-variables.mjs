import servicenow from "../../servicenow.app.mjs";
import { describeCatalogVariables } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-catalog-item-variables",
  name: "Get Catalog Item Variables",
  description: "Retrieve the ordered variables (form fields) for a ServiceNow catalog item or record producer, with where each field's valid values come from. Run **Search Catalog Items** first to obtain the item `sys_id`, then use the returned variable `name`s to build the `variables` payload for **Add Item to Cart**, **Order Catalog Item**, or **Submit Record Producer**, and fill every variable with `mandatory: true`. Each choice-based variable has an `options` object: when `options.source` is `choices`, pick a `value` from the inline `choices` (lookup choices are already filtered by ServiceNow for the signed-in user); when it is `table`, run **Get Table Records** on `options.table` with `options.query` (if present) plus the user's search text and submit the record `sys_id`. `options.qualifier_unresolved: true` means the form filters this field with a script (`options.qualifier_script`) that cannot be evaluated here: do not reimplement the script with other queries or state which records it allows, tell the user the valid choices are decided by the form, and confirm the value they want; `options.depends_on` lists variables whose values change the valid options. Script defaults such as the current user are resolved into `value`, with the original script in `default_script`. Use **Get Catalog Item** for item details such as price and category. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.6",
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
  },
  methods: {
    async resolveScriptDefault($, variable, cache) {
      const script = variable.default_script.trim();
      if (script.includes("^")) {
        return "";
      }
      const key = `${variable.reference}|${script}`;
      if (!cache.has(key)) {
        cache.set(key, this.servicenow.getTableRecords({
          $,
          table: variable.reference,
          params: {
            sysparm_query: `sys_id=${script}`,
            sysparm_fields: "sys_id",
            sysparm_limit: 2,
          },
        }).then((records) => (Array.isArray(records) && records.length === 1
          ? records[0].sys_id
          : ""))
          .catch((error) => {
            console.log(`Could not resolve the default for variable ${variable.name} on ${variable.reference}: ${error?.message ?? error}`);
            return "";
          }));
      }
      return cache.get(key);
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.getCatalogItemVariables({
      $,
      catalogItemSysId: this.catalogItemSysId,
    });

    const {
      variables, scriptDefaults,
    } = describeCatalogVariables(Array.isArray(response)
      ? response
      : (response?.variables ?? []));

    const cache = new Map();
    await Promise.all(scriptDefaults.map(async (variable) => {
      const sysId = await this.resolveScriptDefault($, variable, cache);
      if (sysId) {
        variable.value = sysId;
      } else {
        variable.default_unresolved = true;
      }
    }));

    $.export("$summary", `Successfully retrieved ${variables.length} variable(s) for catalog item ${this.catalogItemSysId}`);

    return variables;
  },
};
