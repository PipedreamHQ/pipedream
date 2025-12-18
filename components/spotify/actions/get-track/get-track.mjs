import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Track",
  description: "Get a track by its name or ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/search)",
  key: "spotify-get-track",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    spotify,
    trackId: {
      propDefinition: [
        spotify,
        "trackId",
      ],
    },
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
      trackId,
      market,
    } = this;

    const { data } = await this.spotify._makeRequest({
      $,
      url: `/tracks/${trackId.value ?? trackId}`,
      params: {
        market,
      },
    });

    $.export("$summary", `Successfully fetched info for the track, "${data?.name}"`);

    return data ?? {};
  },
};
