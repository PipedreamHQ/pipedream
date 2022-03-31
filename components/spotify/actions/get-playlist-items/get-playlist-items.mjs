import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Playlist's Items",
  description: "Get full details of the items of a playlist owned by a Spotify user. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks).",
  key: "spotify-get-playlist-items",
  version: "0.0.3",
  type: "action",
  props: {
    spotify,
    playlistId: {
      propDefinition: [
        spotify,
        "playlistId",
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the total number of items and the request limit: `total,limit`. [See the docs](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks) for more information.",
      optional: true,
    },
    limit: {
      propDefinition: [
        spotify,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        spotify,
        "offset",
      ],
    },
    additionalTypes: {
      type: "string[]",
      label: "Additional Types",
      description: "A comma-separated list of item types that your client supports besides the default `track` type. Valid types are: `track` and `episode`. **Note**: This parameter was introduced to allow existing clients to maintain their current behaviour and might be deprecated in the future. In addition to providing this parameter, make sure that your client properly handles cases of new types in the future by checking against the `type` field of each object.",
      optional: true,
      options: [
        "Track",
        "Episode",
      ],
    },
  },
  async run({ $ }) {
    const {
      playlistId,
      market,
      fields,
      limit,
      offset,
      additionalTypes,
    } = this;

    const res = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/playlists/${get(playlistId, "value", playlistId)}/tracks`,
      params: {
        fields,
        market,
        limit,
        offset,
        additional_types: additionalTypes && additionalTypes.join(",").toLowerCase(),
      },
    }));

    $.export("$summary", `Successfully fetched details for "${get(playlistId, "label", playlistId)}"`);

    return get(res, "items", []);
  },
};
