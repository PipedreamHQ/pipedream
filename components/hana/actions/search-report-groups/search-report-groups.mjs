import hana from "../../hana.app.mjs";

export default {
  key: "hana-search-report-groups",
  name: "Search Report Groups",
  description: "Search for report groups. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#get-report-groups)",
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
    const response = await this.hana.searchReportGroups({
      $,
      params: {
        search: this.search,
        per_page: this.perPage,
        page: this.page,
      },
    });
    if (response?.content?.data?.length) {
      $.export("$summary", `Successfully retrieved ${response?.content?.data?.length} report group${response?.content?.data?.length === 1
        ? ""
        : "s"}.`);
    }
    return response;
  },
};
