import spotify from "../../spotify.app.mjs";
import { ITEM_TYPES } from "../../common/constants.mjs";

export default {
  name: "Get currently playing track",
  description:
    "Get the object currently being played on the user's Spotify account. [See the documentation](https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track)",
  key: "spotify-get-currently-playing-track",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    spotify,
    market: {
      propDefinition: [
        spotify,
        "market",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { market } = this;

    try {
      const res = await this.spotify._makeRequest({
        $,
        url: "/me/player/currently-playing",
        params: {
          market,
          additional_types: [
            ITEM_TYPES.TRACK,
            ITEM_TYPES.EPISODE,
          ].join(","),
        },
      });

      const itemType = res?.currently_playing_type || "track";
      const itemName = res?.item?.name || "Nothing";
      $.export("$summary", `Currently playing ${itemType}: ${itemName}`);

      return {
        playing: !!res,
        type: res?.currently_playing_type,
        item: res?.item,
        progress_ms: res?.progress_ms,
        is_playing: res?.is_playing,
      };
    } catch (error) {
      throw new Error(`Failed to get currently playing track for user: ${error.message}`);
    }
  },
};
