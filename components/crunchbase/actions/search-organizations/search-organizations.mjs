import crunchbase from "../../crunchbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crunchbase-search-organizations",
  name: "Search Organizations",
  description: "Search for organizations based on specified criteria. [See the documentation](https://data.crunchbase.com/reference/post_data-searches-organizations)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    crunchbase,
    fieldIds: {
      propDefinition: [
        crunchbase,
        "fieldIds",
      ],
    },
    order: {
      propDefinition: [
        crunchbase,
        "order",
      ],
    },
    query: {
      propDefinition: [
        crunchbase,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.crunchbase.searchOrganizations({
      fieldIds: this.fieldIds,
      order: this.order,
      query: this.query,
    });
    $.export("$summary", "Successfully searched organizations");
    return response;
  },
};
