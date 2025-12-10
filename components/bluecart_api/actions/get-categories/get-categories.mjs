import app from "../../bluecart_api.app.mjs";

export default {
  key: "bluecart_api-get-categories",
  name: "Get Categories",
  description: "Get a list of categories related to the provided search term. [See the documentation](https://docs.trajectdata.com/bluecartapi/walmart-product-data-api/parameters/category)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchTerm: {
      propDefinition: [
        app,
        "searchTerm",
      ],
      description: "The term used to search for categories",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.getCategories({
        $,
        params: {
          search_term: this.searchTerm,
        },
      });

      $.export("$summary", "Successfully retrieved " + response.categories.length + " categories");
      return response;

    } catch (err) {
      if (
        err?.response?.status === 400 &&
        err?.response?.data?.request_info?.message?.includes("No categories match")
      ) {
        const message = err.response.data.request_info.message;

        $.export("$summary", message);
        return {
          success: false,
          categories: [],
          message,
        };
      }
      throw err;
    }
  },
};
