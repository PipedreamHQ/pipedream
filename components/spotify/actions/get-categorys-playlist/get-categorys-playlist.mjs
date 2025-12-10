import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Category's Playlists",
  description: "Get a list of Spotify playlists tagged with a particular category. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-categories-playlists).",
  key: "spotify-get-categorys-playlist",
  version: "0.1.5",
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

    const res = await this.spotify._makeRequest({
      $,
      url: `/browse/categories/${categoryId.value ?? categoryId}/playlists`,
      params: {
        limit,
        offset,
        country: market,
      },
    });

    $.export("$summary", `Successfully fetched playlists for the "${categoryId.label ?? categoryId}" category`);

    return res.playlists?.items ?? [];
  },
};
