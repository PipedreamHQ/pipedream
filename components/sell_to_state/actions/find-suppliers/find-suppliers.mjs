import app from "../../sell_to_state.app.mjs";

export default {
  key: "sell_to_state-find-suppliers",
  name: "Find Suppliers",
  description: "Find companies that won government contracts, by the subject of the contracts or by company name. [See the docs](https://docs.selltostate.com/)",
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
      optional: false,
    },
    match: {
      type: "string",
      label: "Match",
      description: "`awards`: companies that won contracts about the text. `name`: the company name.",
      options: [
        "awards",
        "name",
      ],
      default: "awards",
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
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
        scope: "suppliers",
        q: this.q,
        match: this.match,
        country: this.country,
        per_page: this.limit,
      },
    });
    $.export("$summary", `Found ${response.found} supplier${response.found === 1
      ? ""
      : "s"}`);
    return response.hits;
  },
};
