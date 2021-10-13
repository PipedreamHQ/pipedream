import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Category's Playlists",
  description: "Get a list of Spotify playlists tagged with a particular category. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-categories-playlists)",
  key: "spotify-get-categorys-playlist",
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
      propDefinition: [
        spotify,
        "market",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        spotify,
        "limit",
      ],
      description: "The maximum number of items to return. Default: 20.",
      max: 50,
    },
    offset: {
      propDefinition: [
        spotify,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const {
      categoryId,
      market,
      limit,
      offset,
    } = this;

    return axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/browse/categories/${categoryId}/playlists`,
      params: {
        limit,
        offset,
        country: market,
      },
    }));
  },
};
