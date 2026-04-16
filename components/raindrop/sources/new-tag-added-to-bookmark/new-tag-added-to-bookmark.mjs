import common from "../common/base-polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "raindrop-new-tag-added-to-bookmark",
  name: "New Tag Added to Bookmark",
  description: "Emit new event when a tag is added to a bookmark",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    tags: {
      propDefinition: [
        common.props.raindrop,
        "tags",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      let maxLastUpdated = 0;
      const previousTagAssignments = {};
      this.tags.forEach((tag) => {
        previousTagAssignments[tag] = {};
      });
      for await (const bookmark of this.getRecentlyUpdatedBookmarks(maxLastUpdated)) {
        this.tags.forEach((tag) => {
          if (bookmark.tags.includes(tag)) {
            previousTagAssignments[tag][bookmark._id] = true;
          }
        });
        maxLastUpdated = Math.max(maxLastUpdated, Date.parse(bookmark.lastUpdate));
      }
      this._setPreviousTagAssignments(previousTagAssignments);
      this._setLastUpdated(maxLastUpdated);
    },
  },
  methods: {
    _getLastUpdated() {
      return this.db.get("lastUpdated");
    },
    _setLastUpdated(lastUpdated) {
      this.db.set("lastUpdated", lastUpdated);
    },
    _getPreviousTagAssignments() {
      return this.db.get("previousTagAssignments");
    },
    _setPreviousTagAssignments(previousTagAssignments) {
      this.db.set("previousTagAssignments", previousTagAssignments);
    },
    getSearchQuery(tags) {
      return `${tags.map((s) => `#"${s}"`).join(" ")} match:OR`;
    },
    async *getRecentlyUpdatedBookmarks(lastUpdated) {
      const params = {
        page: 0,
        perpage: constants.DEFAULT_PER_PAGE,
        search: this.getSearchQuery(this.tags),
      };
      while (true) {
        const { items } = await this.raindrop.getRaindrops(this, this.collectionId, params);
        for (const bookmark of items) {
          if (Date.parse(bookmark.lastUpdate) > lastUpdated) {
            yield bookmark;
          }
        }
        if (items.length < constants.DEFAULT_PER_PAGE) break;
        params.page++;
      }
    },
    generateMeta(bookmark, tag) {
      const ts = Date.parse(bookmark.lastUpdate);
      return {
        id: `${bookmark._id}-${tag}-${ts}`,
        summary: `Tag "${tag}" added to bookmark ${bookmark._id}`,
        ts,
      };
    },
  },
  async run() {
    const lastUpdated = this._getLastUpdated();
    let maxLastUpdated = lastUpdated;
    const previousTagAssignments = this._getPreviousTagAssignments();

    for await (const bookmark of this.getRecentlyUpdatedBookmarks(lastUpdated)) {
      this.tags.forEach((tag) => {
        if (bookmark.tags.includes(tag)) {
          if (!previousTagAssignments[tag][bookmark._id]) {
            this.$emit(bookmark, this.generateMeta(bookmark, tag));
            previousTagAssignments[tag][bookmark._id] = true;
          }
        } else {
          if (previousTagAssignments[tag][bookmark._id]) {
            delete previousTagAssignments[tag][bookmark._id];
          }
        }
      });
      this._setPreviousTagAssignments(previousTagAssignments);
      maxLastUpdated = Math.max(maxLastUpdated, Date.parse(bookmark.lastUpdate));
    }
    this._setLastUpdated(maxLastUpdated);
  },
};
