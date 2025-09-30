import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-images",
  name: "Google Images API",
  description: "Google Images API uses /api/v1/search?engine=google_images API endpoint to scrape real-time results. [See the documentation](https://www.searchapi.io/docs/google-images)",
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
    size: {
      propDefinition: [
        app,
        "size",
      ],
    },
    color: {
      propDefinition: [
        app,
        "color",
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
    const engine = "google_images";
    const params = {
      q: this.q,
      size: this.size,
      color: this.color,
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

    $.export("$summary", `Successfully searched "${this.q} on engine ${engine}"`);

    return result;
  },
};
