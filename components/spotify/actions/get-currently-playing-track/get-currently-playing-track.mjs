import { axios } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
    name: "Get currently playing track",
    description: "Get the object currently being played on the user's Spotify account.",
    key: "spotify-get-currently-playing-track",
    version: "0.0.1",
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
        const {
            market,
        } = this;

    const res = await axios($, this.spotify._getAxiosParams({
        method: "GET",
        path: `/me/player/currently-playing`,
        params: {
            market,
        },
    }));

    $.export("$summary", "Successfully retrieved currently playing track for user");

    return res;
  },
}