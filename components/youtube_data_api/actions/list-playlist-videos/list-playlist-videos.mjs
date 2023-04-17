import youtubeDataApi from "../../youtube_data_api.app.mjs";

export default {
  key: "youtube_data_api-list-playlist-videos",
  name: "List Playlist Videos",
  description: "List videos in a playlist. [See the docs](https://developers.google.com/youtube/v3/docs/playlistItems/list) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    playlistId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedPlaylist",
      ],
      description: "Select a **Playlist** or provide a custom *Playlist ID*.",
    },
    maxResults: {
      propDefinition: [
        youtubeDataApi,
        "maxResults",
      ],
      description: "The maximum number of results to return.",
      min: 1,
      max: 50,
      default: 5,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      playlistId,
      maxResults,
    } = this;

    const params = {
      part: "contentDetails,id,snippet,status",
      playlistId,
      maxResults,
    };

    const { data: { items } } = await this.youtubeDataApi.getPlaylistItems(params);
    const { length } = items;
    const summary = length
      ? `Successfully fetched ${length} video${length === 1
        ? ""
        : "s"}`
      : "No videos found";
    $.export("$summary", summary);
    return items;
  },
};
