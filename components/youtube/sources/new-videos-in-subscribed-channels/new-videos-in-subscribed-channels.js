const common = require("../common.js");
const { toArray } = require("../../utils");
const youtube = require("../../youtube.app");
/**
 * @typedef {import('googleapis').youtube_v3.Schema$Subscription} Subscription
 * @typedef {import('googleapis').youtube_v3.Schema$PlaylistItem} PlaylistItem
 * @typedef {import('googleapis').youtube_v3.Schema$Channel} Channel
 */
/**
 * Uses [YouTube API](https://developers.google.com/youtube/v3/docs) to get the authenticated user's
 * subscriptions with a `totalItemCount` for each. The user's subscriptions are used to get the
 * subscribed-to channels. Then the ID of the 'uploads' playlist in each channel is used to get
 * playlist items of recently uploaded videos.
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
module.exports = {
  key: "youtube-new-videos-in-subscribed-channels",
  name: "New Videos in Subscribed to Channels",
  description: "Emit new event for each new YouTube video posted to a subscribed-to channel.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    youtube,
    ...common.props,
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const subscriptions = await this.getSubscriptions();
      this.setChannelData(subscriptions);
      this._setPublishedAfter(new Date().toISOString());
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
          subscriptionId: s.id, // Unused
          channelId, // Unused
          totalItemCount: s.contentDetails.totalItemCount,
          lastPublishedAt: (
            prevChannelData
              && prevChannelData[channelId]
              && prevChannelData[channelId].lastPublishedAt
          ),
        };
        return channels;
      }, {});
      // For each channel with new uploads, set the new `lastPublishedAt` for each channel
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
      const subscriptionStream = this.paginate(this.youtube.getSubscriptions.bind(this), {
        part: "contentDetails,id,snippet",
        mine: true,
      });
      return await toArray(subscriptionStream);
    },
    /**
     * Gets a list of channels from a list of channel IDs
     *
     * @param {String[]} channelIds - A list of channel IDs
     * @returns {Channel[]} The list of subscriptions
     */
    async getChannels(channelIds) {
      const channelStream = this.paginate(this.youtube.getChannels.bind(this), {
        // `part.snippet` contains the `resourceId.channelId`
        // `part.contentDetails` contains the `totalItemCount`
        part: "contentDetails,id",
        id: channelIds.join(","),
      });
      return await toArray(channelStream);
    },
    /**
     * Gets a list of playlist items in the 'uploads' playlist of a channel
     *
     * @param {ChannelData} channelData - The recorded data for each channel to use in filtering
     * playlist items
     * @returns {PlaylistItem[]} The list of playlist items
     */
    async getPlaylistItems(channelData, channel) {
      // Use `playlistId` of [uploads](https://bit.ly/3FuJiC3) playlist
      const playlistId = channel.contentDetails.relatedPlaylists.uploads;
      return await toArray(
        this.paginatePlaylistItems(playlistId, channel.id, channelData),
      );
    },
    /**
     * Paginate through results from` getPlaylistItems()` and yield each playlist item that was
     * published after the channel's last recorded video or the last run of this event source
     *
     * @param {String} playlistId - The id of the playlist from which to paginate items
     * @param {String} channelId - The id of the channel that owns the playlist
     * @param {Object} channelData - A dict mapping channelId to an object containing
     * `lastPublishedAt` times for each channel
     * @yields The next playlist item in the playlist
     * @type {PlaylistItem}
     */
    async *paginatePlaylistItems(playlistId, channelId, channelData) {
      console.log("paginatePlaylistItems", playlistId, channelId);
      // Set `publishedAfter` to `lastPublishedAt` for this channelId if it exists, and this
      // source's `publishAfter` otherwise, which is set to current time on deploy and run
      const publishedAfter = channelData[channelId].lastPublishedAt
        ? Date.parse(channelData[channelId].lastPublishedAt)
        : Date.parse(this._getPublishedAfter());
      const playlistItemStream = this.paginate(this.youtube.getPlaylistItems.bind(this), {
        part: "contentDetails,id,snippet",
        playlistId,
      });
      for await (const playlistItem of playlistItemStream) {
        console.log("playlistItem", playlistItem);
        // If the playlistItem was published before `publishedAfter`, stop including playlistItems
        if (
          !playlistItem.snippet.publishedAt
          || Date.parse(playlistItem.snippet.publishedAt) <= publishedAfter
        ) {
          return;
        }
        yield playlistItem;
      }
    },
  },

  async run() {
    let channelData = this._getChannelData();
    console.log("channelData", channelData);
    // Get all subscriptions (each has a totalItemCount) for the current user
    const subscriptions = await this.getSubscriptions();

    // Map subscriptions to updated channel IDs
    // If a subscribed channel's `totalItemCount` is greater than its previously recorded
    // `totalItemCount`, assume the channel has a newly uploaded video
    const updatedChannelIds = subscriptions
      // Filter to remove channels whose `totalItemCount` has not increased and channels that are
      // newly subscribed to -- to avoid emitting all of a channels videos
      .filter((s) => (
        channelData[s.snippet.resourceId.channelId]
        && s.contentDetails.totalItemCount >
          channelData[s.snippet.resourceId.channelId].totalItemCount
      ))
      // Map subscription to channelId
      .map((s) => s.snippet.resourceId.channelId);
    console.log("updatedChannelIds", updatedChannelIds);

    // If there are not updated channels, updated channelData and stop
    if (updatedChannelIds.length === 0) {
      return this.setChannelData(subscriptions);
    }

    // Get list of channels using 'updatedChannelIds`
    const channels = await this.getChannels(updatedChannelIds);

    // Get list of playlistItems in the 'uploads' playlist for each updated channel (with new
    // videos) -- use each channel's `lastPublishedAt` in `channelData` to list only playlistItems
    // published after `lastPublishedAt`
    const uploadsPlaylists = await Promise.all(
      channels.map(this.getPlaylistItems.bind(this, channelData)),
    );

    // Set channelData using `subscriptions`and `uploadsPlaylists` to record last publishedAt date
    // for each channel
    this.setChannelData(subscriptions, uploadsPlaylists);
    // Set `publishedAfter` to current time
    this._setPublishedAfter(new Date().toISOString());

    console.log("uploadsPlaylists", uploadsPlaylists);

    // Concatenate playlistItems in uploads playlists
    const allItems = [].concat(...uploadsPlaylists);
    // Sort playlistItems in order of `publishedAt`
    allItems.sort((a, b) => Date.parse(a.snippet.publishedAt) - Date.parse(b.snippet.publishedAt));
    // Emit playlistItems
    allItems.forEach((item) => {
      this.emitEvent(item);
    });
  },
};
