// x-pd-ai: optimized
import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-search",
  name: "Google Search API",
  description: "Run a Google web search. Returns `organic_results` alongside whichever other blocks Google included for the query [See the documentation](https://www.searchapi.io/docs/google)",
  version: "0.0.3",
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
    device: {
      propDefinition: [
        app,
        "device",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    hl: {
      propDefinition: [
        app,
        "hl",
      ],
    },
    gl: {
      propDefinition: [
        app,
        "gl",
      ],
    },
    timePeriod: {
      propDefinition: [
        app,
        "timePeriod",
      ],
    },
    num: {
      propDefinition: [
        app,
        "num",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const engine = "google";
    const params = {
      q: this.q,
      device: this.device,
      domain: this.domain,
      hl: this.hl,
      gl: this.gl,
      time_period: this.timePeriod,
      num: this.num,
      page: this.page,
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
