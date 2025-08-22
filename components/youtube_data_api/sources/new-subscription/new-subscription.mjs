import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-subscription",
  name: "New Subscription",
  description: "Emit new event for each new subscription from authenticated user.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
