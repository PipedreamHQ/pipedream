import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-new-last-urls",
  name: "New Last Shortened URLs",
  description: "Emits an event each time a user gets the last shortened URLs",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    cuttLy,
    userId: {
      propDefinition: [
        cuttLy,
        "userId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastShortenedUrlId() {
      return this.db.get("lastShortenedUrlId");
    },
    _setLastShortenedUrlId(id) {
      this.db.set("lastShortenedUrlId", id);
    },
  },
  async run() {
    const lastShortenedUrlId = this._getLastShortenedUrlId();
    const params = {
      userId: this.userId,
    };
    if (lastShortenedUrlId) {
      params.id = lastShortenedUrlId;
    }
    const { data } = await this.cuttLy._makeRequest({
      method: "GET",
      url: `${this.cuttLy._baseUrl()}/api/shorten`,
      params,
      headers: this.cuttLy._getAuthHeaders(),
    });
    if (data && data.length > 0) {
      data.forEach((shortenedUrl) => {
        this.$emit(shortenedUrl, {
          id: shortenedUrl.id,
          summary: shortenedUrl.title,
          ts: Date.now(),
        });
      });
      this._setLastShortenedUrlId(data[data.length - 1].id);
    }
  },
};
