main_example = """## Example source

Here's an example Pipedream source component that fetches all bookmarks from Raindrop.io and emits each bookmark as an event:

```
import { axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform"
export default {
  key: "raindrop-bookmark-created",
  name: "New Bookmark Created",
  description: `Emit new event when a bookmark is created. [See the documentation](${docsLink})`,
  version: "0.0.{{ts}}",
  type: "source",
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
        // fetch collections from the API
        const { items } = await this.getCollections();
        return items.map((e) => ({
          value: e._id,
          label: e.title,
        }));
      },
    },
  },
  methods: {
    _getPage() {
      return this.db.get("page") ?? 0;
    },
    _setPage(page) {
      this.db.set("page", page);
    },
  },
  hooks: {
    async deploy() {
      let page = 0;
      const all_bookmarks = [];

      while (true) {
        // fetch bookmarks from the API
        const bookmarks = await this.raindrop.getRaindrops(this, this.collectionId, {
          page,
          perpage: MAX_PER_PAGE,
        });
        all_bookmarks.unshift(...bookmarks.reverse());

        if (bookmarks.length < constants.DEFAULT_PER_PAGE) break;
        page++;
      }

      for (const bookmark of all_bookmarks.slice(0, 50)) {
        this.$emit(bookmark, {
          id: bookmark._id,
          summary: `New Raindrop: ${bookmark.title}`,
          ts: Date.parse(bookmark.created),
        });
      }

      this._setPage(page);
    },
  },
  async run() {
    let page = this._getPage();

    while (true) {
      // fetch bookmarks from the API
      const { items: bookmarks } = await this.raindrop.getRaindrops(this, this.collectionId, {
        page,
        perpage: 50,
      });

      for (const bookmark of bookmarks) {
        this.$emit(bookmark, {
          id: bookmark._id,
          summary: `New Raindrop: ${bookmark.title}`,
          ts: Date.parse(bookmark.created),
        });
      };

      if (bookmarks.length < constants.DEFAULT_PER_PAGE) break;

      page++;
    }

    this._setPage(page);
  },
};
```"""
