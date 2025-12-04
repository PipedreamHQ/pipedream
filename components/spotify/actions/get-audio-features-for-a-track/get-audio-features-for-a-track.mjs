import spotify from "../../spotify.app.mjs";

export default {
  name: "Get Audio Features for a Track",
  description: "Get audio feature information for a single track identified by its unique Spotify ID. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features).",
  key: "spotify-get-audio-features-for-a-track",
  version: "0.1.3",
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
  },
  async run({ $ }) {
    const { trackId } = this;
    const resp = await this.spotify._makeRequest({
      $,
      url: `/audio-features/${trackId.value ?? trackId}`,
    });

    $.export("$summary", `Successfully fetched audio info for the track, "${trackId.label ?? trackId}"`);

    return resp;
  },
};
