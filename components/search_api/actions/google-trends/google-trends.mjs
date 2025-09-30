import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-trends",
  name: "Google Trends API",
  description: "Google Trends API uses /api/v1/search?engine=google_trends API endpoint to scrape real-time results. [See the documentation](https://www.searchapi.io/docs/google-trends)",
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

    $.export("$summary", `Successfully searched "${this.q} on engine ${engine}"`);

    return result;
  },
};
