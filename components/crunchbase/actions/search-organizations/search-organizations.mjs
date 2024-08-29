import { FIELDS_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import crunchbase from "../../crunchbase.app.mjs";

export default {
  key: "crunchbase-search-organizations",
  name: "Search Organizations",
  description: "Search for organizations based on specified criteria. [See the documentation](https://data.crunchbase.com/reference/post_data-searches-organizations)",
  version: "0.0.1",
  type: "action",
  props: {
    crunchbase,
    fieldIds: {
      type: "string[]",
      label: "Field IDs",
      description: "Fields to include on the resulting entity",
      options: FIELDS_OPTIONS,
    },
    query: {
      type: "string[]",
      label: "Query",
      description: "Array of stringified objects for searching organizations",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.crunchbase.searchOrganizations({
      $,
      data: {
        field_ids: this.fieldIds,
        query: parseObject(this.query),
      },
    });
    $.export("$summary", "Successfully searched organizations");
    return response;
  },
};
