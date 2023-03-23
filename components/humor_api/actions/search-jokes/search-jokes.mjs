import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-search-jokes",
  name: "Search Jokes",
  description: "With over 50,000 jokes, you should find something for any occasion. There are 27 categories to choose from but you can also search for very specific words within jokes. [See the docs here](https://humorapi.com/docs/#Search-Jokes).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "A comma-separated list of words that must occur in the joke.",
      optional: true,
    },
    includeTags: {
      type: "string[]",
      label: "Included Tags",
      description: "A comma-separated list of tags the jokes should have.",
      optional: true,
    },
    excludeTags: {
      type: "string[]",
      label: "Excluded Tags",
      description: "A comma-separated list of tags the jokes must not have.",
      optional: true,
    },
    maxLength: {
      type: "integer",
      label: "Maximum length",
      description: "The maximum length of the joke in letters.",
      optional: true,
    },
    minRating: {
      type: "integer",
      label: "Minimum rating",
      description: "The minimum rating (0-10) of the jokes.",
      min: 0,
      max: 10,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of jokes to skip, between 0 and 1000.",
      min: 0,
      max: 1000,
      optional: true,
    },
    number: {
      type: "integer",
      label: "Number of jokes",
      description: "The number of jokes, between 0 and 10.",
      min: 0,
      max: 10,
      optional: true,
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

    $.export("$summary", `Successfully fetched ${response.jokes.length} jokes`);

    return response;
  },
};
