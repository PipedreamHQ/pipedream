import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Category's Playlists",
  description: "Get a list of Spotify playlists tagged with a particular category. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-categories-playlists).",
  key: "spotify-get-categorys-playlist",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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

    const res = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/browse/categories/${get(categoryId, "value", categoryId)}/playlists`,
      params: {
        limit,
        offset,
        country: market,
      },
    }));

    $.export("$summary", `Successfully fetched playlists for the "${get(categoryId, "label", categoryId)}" category`);

    return get(res, "playlists.items", []);
  },
};
