import common from "../common.mjs";

export default {
  type: "source",
  key: "youtube_data_api-new-subscription",
  name: "New Subscription",
  description: "Emit new event for each new subscription from authenticated user.",
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
    async _emitLastSubscriptions(maxResults = 50) {
      let nextPageToken;
      do {
        const res = await this.youtubeDataApi.getSubscriptions({
          part: "id,snippet",
          mine: true,
          maxResults,
          pageToken: nextPageToken,
        });
        const items = res.data.items.reverse();
        let lastExecutionDate = this._getLastExecutionDate();

        for (const item of items) {
          const newLastTime = new Date(item.snippet.publishedAt).getTime();

          if (lastExecutionDate > newLastTime) {
            continue;
          }

          this.$emit(item, {
            id: item.id,
            summary: item.snippet.title,
            ts: new Date(item.snippet.publishedAt),
          });

          if (!lastExecutionDate || (newLastTime > lastExecutionDate)) {
            this._setLastExecutionDate(newLastTime);
            lastExecutionDate = newLastTime;
          }
        }
        nextPageToken = res.data.nextPageToken;
      } while (nextPageToken);
    },
  },
  hooks: {
    async activate() {
      await this._emitLastSubscriptions(25);
    },
  },
  async run() {
    await this._emitLastSubscriptions();
  },
};
