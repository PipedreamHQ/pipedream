import teamioo from "../../teamioo.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "teamioo-new-url-bookmarked",
  name: "New URL Bookmarked",
  description: "Emit new event when a new URL is bookmarked in a group. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.${ts}",
  type: "source",
  dedupe: "unique",
  props: {
    teamioo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    groupid: {
      propDefinition: [
        teamioo,
        "groupid",
      ],
    },
    bookmarkType: {
      propDefinition: [
        teamioo,
        "bookmarkType",
        (c) => ({
          bookmarkType: "group",
        }),
      ],
    },
    url: {
      propDefinition: [
        teamioo,
        "url",
      ],
    },
    title: {
      propDefinition: [
        teamioo,
        "title",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for deployment logic, if necessary
    },
  },
  methods: {
    async fetchBookmarks() {
      return this.teamioo._makeRequest({
        method: "GET",
        path: `/bookmarks/group/${this.groupid}`,
      });
    },
  },
  async run() {
    const bookmarks = await this.fetchBookmarks();

    bookmarks.forEach((bookmark) => {
      const event = {
        id: bookmark.id,
        summary: `New Bookmark: ${bookmark.title}`,
        ts: new Date(bookmark.created_at).getTime(),
      };
      this.$emit(bookmark, event);
    });

    // Optionally, update the last processed bookmark timestamp or ID
  },
};
