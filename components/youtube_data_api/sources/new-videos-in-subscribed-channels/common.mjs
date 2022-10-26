import common from "../common.mjs";
import { toArray } from "../../common/utils.mjs";

/**
 * @typedef {import('@googleapis/youtube').youtube_v3.Schema$Subscription} Subscription
 * @typedef {import('@googleapis/youtube').youtube_v3.Schema$PlaylistItem} PlaylistItem
 * @typedef {import('@googleapis/youtube').youtube_v3.Schema$Channel} Channel
 */

/**
 * The number of channels to check for new videos whenever the event source is setup and deployed
 * for the first time.
 *
 * Note that the event source could check fewer channels if the authenticated user has fewer
 * subscriptions.
 */
const INITIAL_CHANNEL_COUNT = 10;

/**
 * The number of days ago to emit videos published after on deploy.
 */
const INITIAL_PUBLISHED_AFTER_DAYS_AGO = 7;

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
  hooks: {
    ...common.hooks,
    async deploy() {
      const subscriptions = await this.getSubscriptions();
      this.setChannelData(subscriptions);

      // To emit events on the first run - set `totalItemCount` to 0 for first
      // `INITIAL_CHANNEL_COUNT` subscribed channels to check these channels for new uploads
      const channelData = this._getChannelData();
      subscriptions.slice(0, INITIAL_CHANNEL_COUNT).forEach((s) => {
        channelData[s.snippet.resourceId.channelId].totalItemCount = 0;
      });
      this._setChannelData(channelData);

      this._setPublishedAfter(
        this.youtubeDataApi.daysAgo(INITIAL_PUBLISHED_AFTER_DAYS_AGO).toISOString(),
      );
    },
  },
  methods: {
    ...common.methods,
    generateMeta(playlistItem) {
      const { snippet } = playlistItem;
      return {
        id: snippet.resourceId.videoId,
        summary: snippet.title,
        ts: Date.parse(snippet.publishedAt),
      };
    },
    /**
     * @typedef {{ totalItemCount: Number, lastPublishedAt: String }} ChannelDatum
     * @typedef {Object.<string, ChannelDatum>} ChannelData - A dict mapping channelId to an object
     * containing `lastPublishedAt` times and `totalItemCount` for each channel
     *
     * @returns {ChannelData} The channel data
     */
    _getChannelData() {
      return this.db.get("channelData");
    },
    /**
     * @param {ChannelData} channelData - The channelData to set
     */
    _setChannelData(channelData) {
      this.db.set("channelData", channelData);
    },
    /**
     * Sets current data for each channel using the user's current channel subscriptions and
     * 'uploads' playlists containing newly uploaded videos (playlistItems)
     *
     * @param {Subscription[]} subscriptions - The authenticated user's subscriptions
     * @param {PlaylistItem[]} [itemLists=[]] - A list of playlists with newly uploaded videos
     */
    setChannelData(subscriptions, itemLists = []) {
      const prevChannelData = this._getChannelData();
      // Create `channelData` dict from subscriptions
      let channelData = subscriptions.reduce((channels, s) => {
        const channelId = s.snippet.resourceId.channelId;
        channels[channelId] = {
          totalItemCount: s.contentDetails.totalItemCount,
          lastPublishedAt: (
            prevChannelData
              && prevChannelData[channelId]
              && prevChannelData[channelId].lastPublishedAt
          ),
        };
        return channels;
      }, {});
      // For each channel with new uploads, set the new `lastPublishedAt`
      itemLists.forEach((list) => {
        if (list.length > 0) {
          const channelId = list[0].snippet.videoOwnerChannelId;
          channelData[channelId].lastPublishedAt = list[0].snippet.publishedAt;
        }
      });
      this._setChannelData(channelData);
    },
    /**
     * Gets the full list of subscriptions for the current user
     *
     * @returns {Subscription[]} the list of subscriptions
     */
    async getSubscriptions() {
      // `part.snippet` contains the `resourceId.channelId`
      // `part.contentDetails` contains the `totalItemCount`
      return await this.youtubeDataApi.listAll(this.youtubeDataApi.getSubscriptions.bind(this), {
        part: "contentDetails,id,snippet",
        mine: true,
      });
    },
    /**
     * Gets a list of channels from a list of channel IDs
     *
     * @param {String[]} channelIds - A list of channel IDs
     * @returns {Channel[]} The list of subscriptions
     */
    async getChannels(channelIds) {
      return await this.youtubeDataApi.listAll(this.youtubeDataApi.getChannels.bind(this), {
        part: "contentDetails,id",
        id: channelIds.join(","),
      });
    },
    /**
     * Gets a list of playlist items in the 'uploads' playlist of a channel published after the last
     * processed video from that playlist
     *
     * @param {ChannelData} channelData - The recorded data for each channel to use in filtering
     * playlist items
     * @param {Object} Channel - The channel from which to get 'uploads' playlist items
     * @returns {PlaylistItem[]} The list of playlist items
     */
    async getPlaylistItems(channel, channelData, publishedAfter) {
      // Use `playlistId` of [uploads](https://bit.ly/3FuJiC3) playlist
      const playlistId = channel.contentDetails.relatedPlaylists.uploads;
      publishedAfter = channelData[channel.id].lastPublishedAt
        ? Date.parse(channelData[channel.id].lastPublishedAt)
        : Date.parse(publishedAfter);
      return await toArray(this.youtubeDataApi.paginateUntil(
        this.youtubeDataApi.getPlaylistItems.bind(this),
        {
          part: "contentDetails,id,snippet",
          playlistId,
        },
        null,
        (item) => (
          !item.snippet.publishedAt
          || Date.parse(item.snippet.publishedAt) <= publishedAfter
        ),
      ));
    },
  },
  async run() {
    let channelData = this._getChannelData();
    const publishedAfter = this._getPublishedAfter();

    // Get all subscriptions (each has a totalItemCount) for the current user
    const subscriptions = await this.getSubscriptions();

    // To avoid making an separate API request for each subscribed channel's uploads, include only
    // channels whose `totalItemCount` is greater than its previously recorded `totalItemCount`
    const updatedChannelIds = subscriptions
      .filter((s) => (
        channelData[s.snippet.resourceId.channelId]
        && s.contentDetails.totalItemCount >
          channelData[s.snippet.resourceId.channelId].totalItemCount
      ))
      .map((s) => s.snippet.resourceId.channelId);

    if (updatedChannelIds.length === 0) {
      return this.setChannelData(subscriptions);
    }

    const channels = await this.getChannels(updatedChannelIds);

    const uploadsPlaylists = await Promise.all(
      channels.map((channel) =>
        this.getPlaylistItems(channel, channelData, publishedAfter)),
    );

    this.setChannelData(subscriptions, uploadsPlaylists);
    this._setPublishedAfter(new Date().toISOString());

    const allItems = [].concat(...uploadsPlaylists);
    // Sort playlistItems in order of `publishedAt`
    allItems.sort((a, b) => Date.parse(a.snippet.publishedAt) - Date.parse(b.snippet.publishedAt));

    // Emit playlistItems
    allItems.forEach((item) => {
      this.emitEvent(item);
    });
  },
};
