import kommo from "../../kommo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kommo-search-companies",
  name: "Search Companies",
  description: "Searches for companies within Kommo or lists all of them. [See the documentation](https://www.kommo.com/developers/content/api_v4/companies-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kommo,
    searchKeyword: {
      propDefinition: [
        kommo,
        "searchKeyword",
      ],
    },
    filterCriteria: {
      propDefinition: [
        kommo,
        "filterCriteria",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kommo.searchCompanies({
      searchKeyword: this.searchKeyword,
      filterCriteria: this.filterCriteria,
    });

    $.export("$summary", `Successfully found ${response.length} companies`);
    return response;
  },
};
