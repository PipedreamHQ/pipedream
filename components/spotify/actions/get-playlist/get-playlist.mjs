import spotify from "../../spotify.app.mjs";

export default {
  name: "Get a Playlist",
  description: "Get a playlist owned by a Spotify user. [See the documentation](https://developer.spotify.com/documentation/web-api/reference/get-playlist).",
  key: "spotify-get-playlist",
  version: "0.0.1",
  type: "action",
  props: {
    spotify,
    playlistId: {
      propDefinition: [
        spotify,
        "playlistId",
      ],
    },
  },
  async run({ $ }) {
    const {
      spotify,
      playlistId,
    } = this;

    const response = await spotify.getPlaylist({
      $,
      playlistId: playlistId.value,
    });

    $.export("$summary", `The playlist with Id: ${playlistId.value} was successfully fetched!`);

    return response;
  },
};
