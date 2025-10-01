import odoo from "../../odoo.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "odoo-search-read-records",
  name: "Search and Read Records",
  description: "Search and read records from Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#search-and-read)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    odoo,
    filter: {
      type: "string",
      label: "Search Filter",
      description: "The criterion to search by. E.g. `[[[\"is_company\", \"=\", true]]]`. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/backend/orm.html#search-domains) for information about constructing a search domain",
      optional: true,
    },
    fields: {
      propDefinition: [
        odoo,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const args = this.fields
      ? {
        fields: this.fields,
      }
      : {};
    const response = await this.odoo.searchAndReadRecords(parseObject(this.filter), args);
    $.export("$summary", `Successfully retrieved ${response.length} record${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
