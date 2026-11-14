import app from "../../veilstrat.app.mjs";

export default {
  key: "veilstrat-search-signal-slices",
  name: "Search Signal Slices",
  description: "Retrieve a filtered signal slice. Use **Get Filter Catalog** for current slice identifiers; provide Countries or Minimum Score. [See the documentation](https://app.veilstrat.com/docs/api/endpoints)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    slice: {
      "type": "string",
      "label": "Slice",
      "description": "A slice identifier from Get Filter Catalog, for example `ai-sdr-hiring`.",
    },
    countries: {
      propDefinition: [
        app,
        "countries",
      ],
    },
    scoreMin: {
      "type": "integer",
      "label": "Minimum Score",
      "description": "Optional minimum research-priority score from 0 to 100. Required when Countries is empty.",
      "min": 0,
      "max": 100,
      "optional": true,
    },
  },
  async run({ $ }) {
    const result = await this.app.searchSlices({
      $,
      slice: this.slice,
      countries: this.countries,
      scoreMin: this.scoreMin,
    });
    $.export("$summary", "Retrieved a filtered signal slice");
    return result;
  },
};
