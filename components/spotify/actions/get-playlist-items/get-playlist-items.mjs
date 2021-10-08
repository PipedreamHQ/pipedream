import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Playlist's Items",
  description: "Get full details of the items of a playlist owned by a Spotify user. See the docs here: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-playlists-tracks",
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
    market: {
      type: "string",
      label: "Market",
      description: "An [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). Synonym for country. Provide this parameter if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/). For episodes, if a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter. Note: If neither market or user country are provided, the episode is considered unavailable for the client.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the total number of items and the request limit: `fields=total,limit`. A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects. For example, to get just the added date and user ID of the adder: `fields=items(added_at,added_by.id)`. Use multiple parentheses to drill down into nested objects, for example: `fields=items(track(name,href,album(name,href)))`. Fields can be excluded by prefixing them with an exclamation mark, for example: `fields=items.track.album(!external_urls,images)`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to return. Default: 100. Minimum: 1. Maximum: 100.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The index of the first item to return. Default: 0 (the first object).",
      optional: true,
    },
    additionalTypes: {
      type: "string",
      label: "Additional Types",
      description: "A comma-separated list of item types that your client supports besides the default `track` type. Valid types are: `track` and `episode`. **Note**: This parameter was introduced to allow existing clients to maintain their current behaviour and might be deprecated in the future. In addition to providing this parameter, make sure that your client properly handles cases of new types in the future by checking against the `type` field of each object.",
      optional: true,
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

    const query = this.spotify._getQuery({
      fields,
      market,
      limit,
      offset,
      additional_types: additionalTypes,
    });

    return axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: `/playlists/${playlistId}/tracks${query}`,
    }));
  },
};
