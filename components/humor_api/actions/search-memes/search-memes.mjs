import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-search-memes",
  name: "Search Memes",
  description: "Searches for memes based on user-defined criteria. [See the docs here](https://humorapi.com/docs/#Search-Memes).",
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
    keywordsInImage: {
      type: "boolean",
      label: "Keywords In Image",
      description: "Whether the keywords must occur in the image.",
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The media type (either 'image', 'video' or even specific format such as 'jpg', 'png', or 'gif').",
      optional: true,
      options: [
        "image",
        "video",
        "jpg",
        "png",
        "gif",
      ],
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

    $.export("$summary", `Successfully fetched ${response.memes.length} memes`);

    return response;
  },
};
