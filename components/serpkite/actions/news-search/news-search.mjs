import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-news-search",
  name: "News Search",
  description: "Search Google news with SerpKite and return structured results. [See the documentation](https://serpkite.com/docs/endpoints/news)",
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
    num: {
      propDefinition: [
        app,
        "num",
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
    const response = await this.app.news({
      $,
      params: {
        q: this.q,
        country: this.country,
        language: this.language,
        num: this.num,
        time: this.time,
      },
    });
    $.export("$summary", `Retrieved ${response.results.length} results`);
    return response;
  },
};
