import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/sources/new-subscription/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-new-subscription",
  name: "New Subscription",
  description: "Emit new event for each new subscription from authenticated user.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
