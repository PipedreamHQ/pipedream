import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-update-channel",
  name: "Update Channel",
  description: "Updates a channel's metadata. [See the documentation](https://developers.google.com/youtube/v3/docs/channels/update) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    channelId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedChannel",
      ],
    },
    description: {
      propDefinition: [
        youtubeDataApi,
        "description",
      ],
      description: "The channel's description",
      optional: true,
    },
    defaultLanguage: {
      propDefinition: [
        youtubeDataApi,
        "hl",
      ],
      description: "The language of the text in the channel resource",
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords associated with your channel",
      optional: true,
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
