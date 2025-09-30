import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/delete-playlist-items/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-delete-playlist-items",
  name: "Delete Playlist Items",
  description: "Deletes a playlist item. [See the docs](https://developers.google.com/youtube/v3/docs/playlistItems/delete) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    playlistId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedPlaylist",
      ],
    },
    videoIds: {
      type: "string[]",
      label: "Video Ids",
      description: "Array of identifiers of the videos to be removed from the playlist",
      async options() {
        const { data } = await this.youtubeDataApi.getPlaylistItems({
          part: "contentDetails,id,snippet,status",
          playlistId: this.playlistId,
        });
        return data?.items?.map((item) => ({
          label: item.snippet.title,
          value: item.id,
        })) || [];
      },
    },
    onBehalfOfContentOwner: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwner",
      ],
    },
    ...common.props,
  },
};
