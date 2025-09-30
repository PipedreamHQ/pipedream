import giphyApp from "../../giphy.app.mjs";

export default {
  name: "Translate a Word to a Gif/Sticker",
  description: "Translates or convert a word or phrase to the perfect Gif or Sticker using GIPHY's special sauce algorithm. [See the docs here](https://developers.giphy.com/docs/api/endpoint#translate).",
  key: "giphy-translate-term-to-a-gif-sticker",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    giphyApp,
    searchType: {
      type: "string",
      label: "Search Type",
      description: "The type of resource you want to search",
      options: [
        "gifs",
        "stickers",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search term.",
    },
    weirdness: {
      type: "integer",
      label: "Weirdness",
      description: "Value from 0-10 which makes results weirder as you go up the scale.",
      min: 0,
      max: 10,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      searchType,
      query,
      weirdness,
    } = this;

    const params = {
      s: query,
      weirdness,
    };

    const data = await this.giphyApp.translateTerm(searchType, params, $);
    $.export("$summary", "Term successfully translated");
    return data;
  },
};
