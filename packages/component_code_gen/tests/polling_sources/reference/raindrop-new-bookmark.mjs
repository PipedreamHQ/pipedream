import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "raindrop-new-bookmark",
  name: "New Bookmark",
  description: "Emit new event when a bookmark is added",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    raindrop: {
      type: "app",
      app: "raindrop",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The collection ID",
      async options() {
        const { items } = await this.getCollections();
        return items.map((e) => ({
          value: e._id,
          label: e.title,
        }));
      },
    },
  },
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        method = "get",
        path,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `https://api.raindrop.io/rest/v1${path}`,
        headers: {
          ...opts.headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.raindrop.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async getRaindrops($, collectionId, params) {
      return this._makeRequest($, {
        path: `/raindrops/${collectionId}`,
        params,
      });
    },
    _getPage() {
      return this.db.get("page") ?? 0;
    },
    _setPage(page) {
      this.db.set("page", page);
    },
    getMetadata(bookmark) {
      return {
        id: bookmark._id,
        summary: `New Raindrop: ${bookmark.title}`,
        ts: Date.parse(bookmark.created),
      };
    },
    emitEvents(bookmarks) {
      bookmarks.forEach((bookmark) => {
        const meta = this.getMetadata(bookmark);
        this.$emit(bookmark, meta);
      });
    },
  },
  async run() {
    let page = this._getPage();

    while (true) {
      const { items: bookmarks } = await this.getRaindrops(this, this.collectionId, {
        page,
        perpage: 25,
      });
      this.emitEvents(bookmarks);

      if (bookmarks.length < 25) break;

      page++;
    }

    this._setPage(page);
  },
};
