import countdownApi from "../../countdown_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "countdown_api-get-search-results",
  name: "Get Search Results from eBay",
  description: "Retrieves search results from eBay based on the provided search term, eBay domain, and type. [See the documentation](https://www.countdownapi.com/docs/ebay-product-data-api/parameters/search)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    countdownApi,
    search_term: {
      propDefinition: [
        countdownApi,
        "search_term",
      ],
    },
    ebay_domain: {
      propDefinition: [
        countdownApi,
        "ebay_domain",
      ],
    },
    type: {
      propDefinition: [
        countdownApi,
        "type",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.countdownApi.searchProducts({
      search_term: this.search_term,
      ebay_domain: this.ebay_domain,
      type: this.type,
    });

    $.export("$summary", `Successfully retrieved search results for ${this.search_term}`);
    return response;
  },
};
