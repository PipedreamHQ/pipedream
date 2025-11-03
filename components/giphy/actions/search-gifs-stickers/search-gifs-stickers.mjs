import giphyApp from "../../giphy.app.mjs";
import options from "../../common/constants.mjs";

export default {
  name: "Search Gifs/Stickers",
  description: "Searches all GIPHY gifs or stickers for a word or phrase. [See the docs here](https://developers.giphy.com/docs/api/endpoint#search).",
  key: "giphy-search-gifs-stickers",
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
      description: "Search query term or phrase. Adding `@<username>` anywhere in the q parameter effectively changes the search query to be a search for a specific user’s GIFs (user has to be public and verified user by GIPHY.) Maximum length: 50 chars.",
    },
    rating: {
      type: "string",
      label: "Rating",
      description: "Filters results by [specified rating](https://developers.giphy.com/docs/optional-settings/#rating). Acceptable values include `g`, `pg`, `pg-13`, `r`. If you do not specify a rating, you will receive results from all possible ratings.",
      options: options.rating,
      optional: true,
    },
    max: {
      propDefinition: [
        giphyApp,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const {
      searchType,
      query,
      rating,
      max,
    } = this;

    const params = {
      q: query,
      rating,
    };

    const data = await this.giphyApp.getGifsOrStickers(searchType, params, max, $);
    if (data.length === 0) {
      $.export("$summary", "No data fetched");
    } else {
      $.export("$summary", `${data.length} register(s) fetched`);
    }
    return data;
  },
};
