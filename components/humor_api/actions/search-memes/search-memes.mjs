import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-search-memes",
  name: "Search Memes",
  description: "Searches for memes based on user-defined criteria. [See the docs here](https://humorapi.com/docs/#Search-Memes).",
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
      keywordsInImage,
      mediaType,
      minRating,
      offset,
      number,
    } = this;

    const response = await this.app.searchMemes({
      $,
      params: {
        "keywords": (keywords || []).join(","),
        "keywords-in-image": keywordsInImage,
        "media-type": mediaType,
        "min-rating": minRating,
        "offset": offset,
        "number": number,
      },
    });

    $.export("$summary", `Successfully fetched ${response.memes.length} meme(s)`);

    return response;
  },
};
