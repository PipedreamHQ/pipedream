import common from "../common/base.mjs";

export default {
  ...common,
  key: "mastodon-new-status-bookmarked",
  name: "New Status Bookmarked",
  description: "Emit new event when the specified status is bookmarked. [See the docs here](https://docs.joinmastodon.org/methods/bookmarks/)",
  version: "0.0.12",
  type: "source",
  dedupe: "unique",
  methods: {
    setLastSinceId(value) {
      this.db.set("lastSinceId", value);
    },
    getLastSinceId() {
      return this.db.get("lastSinceId");
    },
    generateMeta(bookmark) {
      return {
        id: bookmark.id,
        summary: `New Bookmark ${bookmark.id}`,
        ts: Date.parse(bookmark.created_at),
      };
    },
  },
  async run() {
    let url;
    let hasNext;
    let minId;

    do {
      const {
        headers: { link },
        data: bookmarks,
      } = await this.mastodon.listBookmarkedStatuses({
        url,
        params: {
          min_id: this.getLastSinceId(),
          limit: 2,
        },
      });

      if (!bookmarks.length) {
        console.log("no more bookmarks");
        return;
      }

      hasNext = link?.includes("next");

      if (hasNext) {
        console.log("link!!!", link);
        const urlRel = link.split(",")[1];
        url = urlRel.substring(urlRel.indexOf("<") + 1, urlRel.lastIndexOf(">"));
        const params = new URLSearchParams(url);
        minId = params.get("min_id");
      }

      if (minId) {
        this.setLastSinceId(minId);
        minId = undefined;
      }

      bookmarks.forEach((bookmark) => {
        const meta = this.generateMeta(bookmark);
        this.$emit(bookmark, meta);
      });

    } while (hasNext);
  },
};
