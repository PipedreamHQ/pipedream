import common from "../common/base.mjs";

export default {
  ...common,
  key: "mastodon-new-bookmark",
  name: "New Status Bookmarked",
  description: "Emit new event when the specified status is bookmarked. [See the docs here](https://docs.joinmastodon.org/methods/bookmarks/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    setLastMaxId(value) {
      this.db.set("lastMaxId", value);
    },
    getLastMaxId() {
      return this.db.get("lastMaxId");
    },
    getUrl(str) {
      return str.substring(str.indexOf("<") + 1, str.lastIndexOf(">"));
    },
    getUrlParam(str, key) {
      const url = this.getUrl(str);
      const params = new URLSearchParams(url);
      return params.get(key);
    },
    generateMeta(bookmark) {
      return {
        id: bookmark.id,
        summary: `New Bookmark ${bookmark.id}`,
        ts: Date.parse(bookmark.created_at),
      };
    },
    emitEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run() {
    let hasNext;

    do {
      const {
        headers: { link },
        data: bookmarks,
      } = await this.mastodon.listBookmarkedStatuses({
        params: {
          max_id: this.getLastMaxId(),
          limit: 40,
        },
      });

      hasNext = link?.includes("next");

      if (hasNext) {
        const [
          str,
        ] = link.split(",");

        this.setLastMaxId(this.getUrlParam(str, "max_id"));
      }

      bookmarks.forEach(this.emitEvent);

    } while (hasNext);

    this.setLastMaxId(null);
  },
};
