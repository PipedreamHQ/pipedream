import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-image-search",
  name: "Image Search",
  description: "Search Google Images: image URL, size, title and source page. A page holds up to 100 images. Failed and empty requests are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/images)",
  version: "0.0.1",
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
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    time: {
      propDefinition: [
        app,
        "time",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/images",
      data: {
        q: this.q,
        country: this.country,
        language: this.language,
        location: this.location,
        page: this.page,
        time: this.time,
      },
    });
    $.export("$summary", `Retrieved ${response.results?.length ?? 0} results`);
    return response;
  },
};
