import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-random-meme",
  name: "Random Meme",
  description: "Searches for a random meme every time. [See the docs here](https://humorapi.com/docs/#Random-Meme).",
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
    keywordsInImage: {
      propDefinition: [
        app,
        "keywordsInImage",
      ],
    },
    mediaType: {
      propDefinition: [
        app,
        "mediaType",
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
      keywords,
      keywordsInImage,
      mediaType,
      minRating,
    } = this;

    const response = await this.app.randomMeme({
      $,
      params: {
        "keywords": (keywords || []).join(","),
        "keywords-in-image": keywordsInImage,
        "media-type": mediaType,
        "min-rating": minRating,
      },
    });

    $.export("$summary", `Successfully fetched a random meme with ID: ${response.id}`);

    return response;
  },
};
