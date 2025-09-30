import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-random-joke",
  name: "Random Joke",
  description: "Searches for a random joke every time. [See the docs here](https://humorapi.com/docs/#Random-Joke).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
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
  },
  async run({ $ }) {
    const {
      includeTags,
      excludeTags,
      maxLength,
      minRating,
    } = this;

    const response = await this.app.randomJoke({
      $,
      params: {
        "include-tags": (includeTags || []).join(","),
        "exclude-tags": (excludeTags || []).join(","),
        "max-length": maxLength,
        "min-rating": minRating,
      },
    });

    $.export("$summary", `Successfully fetched a random joke with ID: ${response.id}`);

    return response;
  },
};
