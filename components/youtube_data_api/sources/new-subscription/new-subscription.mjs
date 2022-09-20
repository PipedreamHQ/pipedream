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
    async _emitLastSubscriptions() {
      const lastExecutionDate = this._getLastExecutionDate();
      let nextPageToken = null;
      do {
        const res = await this.youtubeDataApi.getSubscriptions({
          part: "id,snippet",
          mine: true,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        for (const item of res.data.items) {
          if (new Date(item.snippet.publishedAt).getTime() < lastExecutionDate) {
            return;
          }
          this.$emit(item, {
            id: item.id,
            summary: item.snippet.title,
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
