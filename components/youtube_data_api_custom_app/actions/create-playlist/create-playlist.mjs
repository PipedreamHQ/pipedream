import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/create-playlist/common.mjs";
import consts from "@pipedream/youtube_data_api/common/consts.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-create-playlist",
  name: "Create Playlist",
  description: "Creates a playlist. [See the docs](https://developers.google.com/youtube/v3/docs/playlists/insert) for more information",
  version: "0.0.2",
  type: "action",
  props: {
    youtubeDataApi,
    title: {
      propDefinition: [
        youtubeDataApi,
        "title",
      ],
      description: "The playlist's title",
    },
    description: {
      propDefinition: [
        youtubeDataApi,
        "description",
      ],
      description: "The playlist's description",
      optional: true,
    },
    privacyStatus: {
      type: "string",
      label: "Privacy Status",
      description: "The playlist's privacy status",
      options: consts.UPDATE_PLAYLIST_PRIVACY_STATUS_OPTS,
      optional: true,
    },
    onBehalfOfContentOwner: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwner",
      ],
    },
    onBehalfOfContentOwnerChannel: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwnerChannel",
      ],
    },
    ...common.props,
  },
};
