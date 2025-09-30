import app from "../../invidious.app.mjs";

export default {
  key: "invidious-search-suggestions",
  name: "Get Search Suggestions",
  description: "Get search suggestions for a given query. [See the documentation](https://docs.invidious.io/api/#get-apiv1searchsuggestions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      description: "The query to get search suggestions for.",
      propDefinition: [
        app,
        "query",
      ],
    },
  },
  methods: {
    getSearchSuggestions(args = {}) {
      return this.app._makeRequest({
        path: "/search/suggestions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getSearchSuggestions,
      q,
    } = this;

    const response = await getSearchSuggestions({
      $,
      params: {
        q,
      },
    });
    $.export("$summary", "Successfully fetched search suggestions.");
    return response;
  },
};
