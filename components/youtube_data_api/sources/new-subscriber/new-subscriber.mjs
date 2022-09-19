import common from "../common.mjs";

export default {
  type: "source",
  key: "youtube_data_api-new-subscriber",
  name: "New Subscriber",
  description: "Emit new event for each new Youtube subscriber to user Channel.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    _getLastExecutionDate() {
      return this.db.get("lastExecutionDate");
    },
    _setLastExecutionDate(lastExecutionDate) {
      this.db.set("lastExecutionDate", lastExecutionDate);
    },
    async _emitLastSubscriptions() {
      const lastExecutionDate = this._getLastExecutionDate();
      let nextPageToken = null;
      do {
        const res = await this.youtubeDataApi.getSubscriptions({
          part: "id,subscriberSnippet,snippet",
          mySubscribers: true,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        for (const item of res.data.items) {
          if (new Date(item.snippet.publishedAt).getTime() < lastExecutionDate) {
            return;
          }
          this.$emit(item, {
            id: item.id,
            summary: item.subscriberSnippet.title,
            ts: new Date(item.snippet.publishedAt),
          });
        }

        nextPageToken = res.data.nextPageToken;
      } while (nextPageToken);
    },
  },
  hooks: {
    activate() {
      this._setLastExecutionDate(new Date().getTime());
    },
  },
  async run() {
    await this._emitLastSubscriptions();
    this._setLastExecutionDate(new Date().getTime());
  },
};
