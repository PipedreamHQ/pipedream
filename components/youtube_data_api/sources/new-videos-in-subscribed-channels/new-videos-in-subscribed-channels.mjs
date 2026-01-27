import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

/**
 * Uses [YouTube API](https://developers.google.com/youtube/v3/docs) to get the authenticated user's
 * subscriptions with a `totalItemCount` for each. The user's subscriptions are used to get the
 * subscribed-to channels. Then the ID of the 'uploads' playlist in each channel is used to get
 * playlist items of recently uploaded videos. Process is taken roughly from [this stackoverflow
 * comment](https://bit.ly/3lp4uRS).
 *
 * Sequence: Subscriptions -> Channels -> PlaylistItems
 *
 * The YouTube API allows [listing channels](https://bit.ly/3Fh5Hm2) using a comma-separated list of
 * channel IDs, so channels are fetched using a single series of paginated requests. To list
 * playlist items [PlaylistItems](https://bit.ly/2WN7EW2), a separate request must be made for each
 * channel's 'uploads' playlist. To limit the number of requests, playlist items are fetched only
 * for channels (subscriptions) whose [totalItemCount](https://bit.ly/3ldUYAR) is greater than the
 * last recorded `totalItemCount`.
 */
export default {
  ...common,
  key: "youtube_data_api-new-videos-in-subscribed-channels",
  name: "New Videos in Subscribed Channels",
  description: "Emit new event for each new YouTube video posted to a subscribed channel.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    ...common.props,
  },
};
