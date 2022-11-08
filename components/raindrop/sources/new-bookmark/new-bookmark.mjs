import raindrop from "../../raindrop.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "raindrop-new-bookmark",
  name: "New Bookmark",
  description: "Emit new event when a bookmark is added",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    raindrop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    collectionId: {
      propDefinition: [
        raindrop,
        "collectionId",
      ],
    },
  },
  methods: {
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
      const { items: bookmarks } = await this.raindrop.getRaindrops(this, this.collectionId, {
        page,
        perpage: constants.DEFAULT_PER_PAGE,
      });
      this.emitEvents(bookmarks);

      if (bookmarks.length < constants.DEFAULT_PER_PAGE) break;

      page++;
    }

    this._setPage(page);
  },
};
