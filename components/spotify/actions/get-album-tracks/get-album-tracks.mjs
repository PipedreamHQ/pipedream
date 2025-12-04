import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";
import { ITEM_TYPES } from "../../consts.mjs";
const DEFAULT_LIMIT = 20;

export default {
  name: "Get Album Tracks",
  description: "Get all tracks in an album. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/get-an-albums-tracks)",
  key: "spotify-get-album-tracks",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    spotify,
    albumId: {
      type: "string",
      label: "Album ID",
      description: "Type to search for any album on Spotify or enter a custom expression to specify an album's [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) (for example, `43ZHCT0cAZBISjO8DG9PnE`).",
      useQuery: true,
      async options({
        query,
        page,
      }) {
        const limit = DEFAULT_LIMIT;
        const albums = await this.spotify.getItems(
          ITEM_TYPES.ALBUM,
          query,
          limit,
          limit * page,
        );
        return {
          options: albums.map((album) => ({
            label: album.name,
            value: album.id,
          })),
        };
      },
    },
  },
  async run({ $ }) {
    const params = {
      limit: DEFAULT_LIMIT,
      offset: 0,
    };
    const tracks = [];
    let total = 0;

    do {
      const { items } = await axios($, this.spotify._getAxiosParams({
        path: `/albums/${this.albumId}/tracks`,
        params,
      }));
      tracks.push(...items);
      total = items.length;
      params.offset += params.limit;
    } while (total === params.limit);

    $.export("$summary", `Successfully retrieved ${tracks.length} track${tracks.length === 1
      ? ""
      : "s"}.`);

    return tracks;
  },
};
