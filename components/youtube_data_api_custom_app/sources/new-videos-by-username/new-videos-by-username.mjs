import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "../../../youtube_data_api/sources/new-videos-by-username/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-by-username",
  name: "New Videos by Username",
  description: "Emit new event for each new Youtube video tied to a username.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
