import app from "../../sell_to_state.app.mjs";

export default {
  key: "sell_to_state-search-tenders",
  name: "Search Tenders",
  description: "Search government tenders and contract awards from official procurement sources in 60+ countries. [See the docs](https://docs.selltostate.com/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    acceptsBids: {
      type: "boolean",
      label: "Accepts Bids Only",
      description: "Only open tenders whose bid deadline is in the future.",
      optional: true,
    },
    lifecycle: {
      type: "string",
      label: "Lifecycle",
      options: [
        "open",
        "awarded",
        "planned",
        "cancelled",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      options: [
        {
          label: "Relevance",
          value: "relevance",
        },
        {
          label: "Nearest deadline",
          value: "deadline",
        },
        {
          label: "Newest published",
          value: "published_desc",
        },
        {
          label: "Newest in Sell to State",
          value: "added_desc",
        },
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.search({
      $,
      params: {
        scope: "tenders",
        q: this.q,
        country: this.country,
        accepts_bids: this.acceptsBids
          ? "true"
          : undefined,
        lifecycle: this.lifecycle,
        sort: this.sort,
        per_page: this.limit,
      },
    });
    $.export("$summary", `Found ${response.found} tender${response.found === 1
      ? ""
      : "s"}`);
    return response.hits;
  },
};
