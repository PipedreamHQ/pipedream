import { ConfigurationError } from "@pipedream/platform";
import geogridapi from "../../geogridapi.app.mjs";

export default {
  key: "geogridapi-get-ranking-history",
  name: "Get Ranking History",
  description: "Get how a listing's ranking evolves for a keyword: every completed grid of the same map (same format, radius and center), oldest first, with the change between the first and the last (`change.average_rank` below 0 = better). Free."
    + " Name the map with **Grid ID** (any grid from **List Grids** or **Run Grid**), or with **Place ID** and **Keyword** (the latest grid sets the format)."
    + " [See the documentation](https://geogridapi.io/en/docs#history)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
    gridId: {
      propDefinition: [
        geogridapi,
        "gridId",
      ],
      optional: true,
    },
    placeId: {
      propDefinition: [
        geogridapi,
        "placeId",
      ],
      description: "With **Keyword**, the listing to follow, e.g. `ChIJN1t_tDeuEmsRUsoyG83frY4`. Use **Find Business** to get a place ID (the `place_id` field). Not needed with **Grid ID**.",
    },
    keyword: {
      propDefinition: [
        geogridapi,
        "keyword",
      ],
      description: "With **Place ID**, the keyword to follow, e.g. `pizza`. Not needed with **Grid ID**.",
      optional: true,
    },
    limit: {
      propDefinition: [
        geogridapi,
        "limit",
      ],
      description: "Maximum number of grids in the history, from `1` to `100`, e.g. `50`. Defaults to `50`.",
    },
  },
  async run({ $ }) {
    if (!this.gridId && !(this.placeId && this.keyword)) {
      throw new ConfigurationError("Provide **Grid ID**, or both **Place ID** and **Keyword**.");
    }
    // A grid ID names the map on its own; the listing and keyword are only used without it.
    const history = await this.geogridapi.getHistory({
      $,
      params: this.gridId
        ? {
          grid_id: this.gridId,
          limit: this.limit,
        }
        : {
          place_id: this.placeId,
          keyword: this.keyword,
          limit: this.limit,
        },
    });
    const count = history.data.length;
    let summary = `${count} grid${count === 1 ? "" : "s"} for "${history.keyword}"`;
    const change = history.change?.average_rank;
    if (typeof change === "number") {
      summary += `, average rank change ${change > 0 ? "+" : ""}${change}`;
    }
    $.export("$summary", summary);
    return history;
  },
};
