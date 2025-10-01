import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-search-jokes",
  name: "Search Jokes",
  description: "Searches for jokes based on user-defined criteria. [See the docs here](https://humorapi.com/docs/#Search-Jokes).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    keywords: {
      propDefinition: [
        app,
        "keywords",
      ],
    },
    includeTags: {
      propDefinition: [
        app,
        "includeTags",
      ],
    },
    excludeTags: {
      propDefinition: [
        app,
        "excludeTags",
      ],
    },
    maxLength: {
      propDefinition: [
        app,
        "maxLength",
      ],
    },
    minRating: {
      propDefinition: [
        app,
        "minRating",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const {
      keywords,
      includeTags,
      excludeTags,
      maxLength,
      minRating,
      offset,
      number,
    } = this;

    const response = await this.app.searchJokes({
      $,
      params: {
        "keywords": (keywords || []).join(","),
        "include-tags": (includeTags || []).join(","),
        "exclude-tags": (excludeTags || []).join(","),
        "max-length": maxLength,
        "min-rating": minRating,
        "offset": offset,
        "number": number,
      },
    });

    $.export("$summary", `Successfully fetched ${response.jokes.length} joke(s)`);

    return response;
  },
};
