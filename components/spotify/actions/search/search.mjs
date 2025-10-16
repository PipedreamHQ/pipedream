import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import get from "lodash/get.js";
import spotify from "../../spotify.app.mjs";
import {
  ITEM_TYPES,
  ITEM_TYPES_RESULT_NAME,
} from "../../consts.mjs";

export default {
  key: "spotify-search",
  name: "Search",
  description: "Search for items on Spotify (tracks, albums, artists, playlists, shows, or episodes). [See the docs here](https://developer.spotify.com/documentation/web-api/reference/search)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spotify,
    query: {
      type: "string",
      label: "Search Query",
      description: "Search query keywords and optional field filters. [See the Spotify docs for query syntax](https://developer.spotify.com/documentation/web-api/reference/search)",
    },
    type: {
      type: "string[]",
      label: "Search Type",
      description: "Type(s) of items to search for",
      options: [
        {
          label: "Album",
          value: ITEM_TYPES.ALBUM,
        },
        {
          label: "Artist",
          value: ITEM_TYPES.ARTIST,
        },
        {
          label: "Playlist",
          value: ITEM_TYPES.PLAYLIST,
        },
        {
          label: "Track",
          value: ITEM_TYPES.TRACK,
        },
        {
          label: "Show",
          value: ITEM_TYPES.SHOW,
        },
        {
          label: "Episode",
          value: ITEM_TYPES.EPISODE,
        },
      ],
      default: [
        ITEM_TYPES.TRACK,
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
      description: "The maximum number of results to return per type.",
      default: 20,
      max: 50,
    },
    offset: {
      propDefinition: [
        spotify,
        "offset",
      ],
    },
    includeExternal: {
      type: "string",
      label: "Include External",
      description: "If `audio` is specified, the response will include any relevant audio content that is hosted externally.",
      optional: true,
      options: [
        "audio",
      ],
    },
  },
  async run({ $ }) {
    const {
      query,
      type,
      market,
      limit,
      offset,
      includeExternal,
    } = this;

    if (!query || query.trim().length === 0) {
      throw new ConfigurationError("Search `query` cannot be empty");
    }

    const types = type;
    if (!types?.length) {
      throw new ConfigurationError("Select at least one search type");
    }

    const res = await axios($, this.spotify._getAxiosParams({
      method: "GET",
      path: "/search",
      params: {
        q: query,
        type: types.join(","),
        market,
        limit,
        offset,
        include_external: includeExternal,
      },
      timeout: 15000,
    }));

    // Collect all items from the response across all search types
    const allItems = types.flatMap(
      (itemType) => get(res, `${ITEM_TYPES_RESULT_NAME[itemType]}.items`, []),
    );

    const typeLabel = types.length > 1
      ? "items"
      : types[0] + (allItems.length !== 1
        ? "s"
        : "");

    $.export("$summary", `Successfully found ${allItems.length} ${typeLabel} matching "${query}"`);

    return res;
  },
};
