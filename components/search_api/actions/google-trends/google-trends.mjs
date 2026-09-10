import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-trends",
  name: "Google Trends API",
  description: "Get Google Trends data for one or more terms; compare terms by passing them comma-separated in `q`, e.g. `HubSpot,Salesforce`. `dataType` decides the block returned: `TIMESERIES` gives `interest_over_time`, `GEO_MAP` gives `interest_by_region`, `RELATED_QUERIES` gives `related_queries`, `RELATED_TOPICS` gives `related_topics`. Values are relative popularity indices (0-100), not search volumes. [See the documentation](https://www.searchapi.io/docs/google-trends)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    dataType: {
      propDefinition: [
        app,
        "dataType",
      ],
    },
    time: {
      propDefinition: [
        app,
        "time",
      ],
    },
    cat: {
      propDefinition: [
        app,
        "cat",
      ],
    },
    geo: {
      propDefinition: [
        app,
        "geo",
      ],
    },
  },
  async run({ $ }) {
    const engine = "google_trends";
    const params = {
      q: this.q,
      data_type: this.dataType,
      time: this.time,
      cat: this.cat,
      geo: this.geo,
    };

    const result = await this.app.search({
      $,
      params,
      engine,
    });

    $.export("$summary", `Successfully searched "${this.q}" on engine ${engine}`);

    return result;
  },
};
