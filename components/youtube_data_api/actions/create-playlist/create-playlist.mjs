import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../common/consts.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-create-playlist",
  name: "Create Playlist",
  description: "Creates a playlist. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/insert) for more information",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
