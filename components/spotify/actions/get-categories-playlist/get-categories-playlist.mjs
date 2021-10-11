import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Category's Playlists",
  description: "Get a list of Spotify playlists tagged with a particular category. See the docs here: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-categories-playlists",
  key: "spotify-a-category-playlist",
  version: "0.0.1",
  type: "action",
  props: {
    spotify,
    categoryId: {
      propDefinition: [
        spotify,
        "categoryId",
      ],
    },
    market: {
      optional: true,
      propDefinition: [
        spotify,
        "market",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Limit",
      description: "The index of the first item to return. Default: 0 (the first object). Use with `limit` to get the next set of items",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      categoryId,
      market,
      limit,
      offset,
    } = this;

    const query = this.spotify._getQuery({
      limit,
      offset,
      country: market,
    });
    return axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/browse/categories/${categoryId}/playlists${query}`,
    }));
  },
};
