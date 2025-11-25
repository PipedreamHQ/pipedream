import app from "../../bluecart_api.app.mjs";

export default {
  key: "bluecart_api-get-autocomplete",
  name: "Get Autocomplete",
  description: "Get autocomplete suggestions for the specified search term. [See the documentation](https://docs.trajectdata.com/bluecartapi/walmart-product-data-api/parameters/autocomplete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    walmartDomain: {
      propDefinition: [
        app,
        "walmartDomain",
      ],
    },
    searchTerm: {
      propDefinition: [
        app,
        "searchTerm",
      ],
      description: "The search term to get autocomplete suggestions for",
    },
  },
  async run({ $ }) {
    const response = await this.app.getAutocomplete({
      $,
      params: {
        search_term: this.searchTerm,
        type: "autocomplete",
      },
    });
    $.export("$summary", "Successfully retrieved " + response.autocomplete_results.length + " suggestions");
    return response;
  },
};
