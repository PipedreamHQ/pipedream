import common from "../common.mjs";

export default {
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
    async _emitLastSubscriptions(max = null) {
      const lastExecutionDate = this._getLastExecutionDate();
      let nextPageToken = null;
      let count = 0;
      do {
        const res = await this.youtubeDataApi.getSubscriptions({
          part: "id,subscriberSnippet,snippet",
          mySubscribers: true,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        for (const item of res.data.items) {
          if (
            (lastExecutionDate && new Date(item.snippet.publishedAt).getTime() < lastExecutionDate)
            || count >= max) {
            return;
          }
          count++;
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
    async deploy() {
      await this._emitLastSubscriptions(25);
    },
    activate() {
      this._setLastExecutionDate(new Date().getTime());
    },
  },
  async run() {
    await this._emitLastSubscriptions();
    this._setLastExecutionDate(new Date().getTime());
  },
};
