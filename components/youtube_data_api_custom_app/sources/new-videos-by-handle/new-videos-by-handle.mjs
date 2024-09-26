import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "../../../youtube_data_api/sources/new-videos-by-handle/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-by-handle",
  name: "New Videos by Handle",
  description: "Emit new event for each new Youtube video tied to a handle.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
