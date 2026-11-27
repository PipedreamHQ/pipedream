import geogridapi from "../../geogridapi.app.mjs";

export default {
  key: "geogridapi-list-grids",
  name: "List Grids",
  description: "List the account's grids, newest first, without the point details, optionally for one listing or one exact keyword. Free."
    + " Returns grid IDs (the `id` field) for **Get Grid**, **Get Grid Image** and **Get Ranking History**; pass `next_before` as **Before** to read the next page."
    + " [See the documentation](https://geogridapi.io/en/docs#grid)",
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
    placeId: {
      propDefinition: [
        geogridapi,
        "placeId",
      ],
      description: "Only the grids of this listing, e.g. `ChIJN1t_tDeuEmsRUsoyG83frY4`. Use **Find Business** to get a place ID (the `place_id` field).",
    },
    keyword: {
      propDefinition: [
        geogridapi,
        "keyword",
      ],
      description: "Only the grids of this exact keyword (case-insensitive), e.g. `pizza`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        geogridapi,
        "limit",
      ],
      description: "Maximum number of grids to return, from `1` to `100`, e.g. `20`. Defaults to `20`.",
    },
    before: {
      type: "string",
      label: "Before",
      description: "ISO 8601 date-time from the `next_before` field of the previous page, e.g. `2026-10-01T09:30:00Z`. Leave empty for the newest grids.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.geogridapi.listGrids({
      $,
      params: {
        place_id: this.placeId,
        keyword: this.keyword,
        limit: this.limit,
        before: this.before,
      },
    });
    $.export("$summary", `Found ${response.data.length} grid${response.data.length === 1 ? "" : "s"}${response.has_more ? " (more available)" : ""}`);
    return response;
  },
};
