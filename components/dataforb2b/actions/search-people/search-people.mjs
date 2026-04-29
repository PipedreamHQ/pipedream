import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-search-people",
  name: "Search People",
  description: "Search professional profiles using advanced filters or a lookalike profile. Returns matching people with their details. [See the documentation](https://docs.dataforb2b.ai/api-reference/search-people)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataforb2b,
    filters: {
      propDefinition: [
        dataforb2b,
        "filters",
      ],
    },
    lookalikeProfile: {
      propDefinition: [
        dataforb2b,
        "lookalikeProfile",
      ],
    },
    lookalikeUseCase: {
      propDefinition: [
        dataforb2b,
        "lookalikeUseCase",
      ],
    },
    count: {
      propDefinition: [
        dataforb2b,
        "count",
      ],
    },
    offset: {
      propDefinition: [
        dataforb2b,
        "offset",
      ],
    },
    enrichLive: {
      propDefinition: [
        dataforb2b,
        "enrichLive",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      count: this.count,
      offset: this.offset,
      enrich_live: this.enrichLive,
    };

    if (this.lookalikeProfile) {
      data.lookalike_profile = this.lookalikeProfile;
      if (this.lookalikeUseCase) {
        data.lookalike_use_case = this.lookalikeUseCase;
      }
    } else if (this.filters) {
      data.filters = typeof this.filters === "string"
        ? JSON.parse(this.filters)
        : this.filters;
    }

    const response = await this.dataforb2b.searchPeople({
      $,
      data,
    });

    $.export("$summary", `Successfully retrieved ${response.count} people (${response.total} total)`);
    return response;
  },
};
