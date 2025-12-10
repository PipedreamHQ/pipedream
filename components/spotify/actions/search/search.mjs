import { ConfigurationError } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";
import {
  ITEM_TYPES_LIST,
  ITEM_TYPES,
  PAGE_SIZE,
} from "../../common/constants.mjs";

export default {
  key: "spotify-search",
  name: "Search",
  description: "Search for items on Spotify (tracks, albums, artists, playlists, shows, or episodes). [See the docs here](https://developer.spotify.com/documentation/web-api/reference/search)",
  version: "0.0.2",
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
      options: ITEM_TYPES_LIST,
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
      default: PAGE_SIZE,
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
    if (!this.query || this.query.trim().length === 0) {
      throw new ConfigurationError("Search `query` cannot be empty");
    }

    if (!this.type) {
      throw new ConfigurationError("Select at least one search type");
    }

    const res = await this.spotify.search({
      $,
      q: this.query,
      type: this.type.join(","),
      market: this.market,
      limit: this.limit,
      offset: this.offset,
      include_external: this.includeExternal,
    });

    $.export("$summary", `Successfully retrieved results matching query: "${this.query}"`);

    return res;
  },
};
