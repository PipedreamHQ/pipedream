import hana from "../../hana.app.mjs";

export default {
  key: "hana-search-spaces",
  name: "Search Spaces",
  description: "Get the Google Chat spaces Hana is integrated in. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#get-spaces-hana-is-integrated-in)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hana,
    search: {
      propDefinition: [
        hana,
        "search",
      ],
    },
    perPage: {
      propDefinition: [
        hana,
        "perPage",
      ],
    },
    page: {
      propDefinition: [
        hana,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hana.searchSpaces({
      $,
      params: {
        search: this.search,
        per_page: this.perPage,
        page: this.page,
      },
    });
    if (response?.content?.data?.length) {
      $.export("$summary", `Successfully retrieved ${response?.content?.data?.length} space${response?.content?.data?.length === 1
        ? ""
        : "s"}.`);
    }
    return response;
  },
};
