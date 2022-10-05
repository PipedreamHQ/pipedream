import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "../../../youtube_data_api/sources/new-videos-by-location/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-videos-by-location",
  name: "New Videos by Location",
  description: "Emit new event for each new YouTube video tied to a location.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
