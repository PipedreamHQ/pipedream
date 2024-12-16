import lobsters from "../../lobste_rs.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "lobste_rs-new-story-by-user",
  name: "New Story by User",
  description: "Emit new event when a new story is posted by the specified user.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lobsters,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The user to watch for stories from. E.g. `adamgordonbell`",
    },
    publishedAfter: {
      type: "string",
      label: "Published After",
      description: "Emit items published after the specified date in ISO 8601 format .e.g `2022-12-07T12:57:10+07:00`",
      default: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  methods: {
    generateMeta(item) {
      return {
        id: this.lobsters.itemKey(item),
        summary: item.title,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const url = `https://lobste.rs/~${this.username}/stories.rss`;

    const items = await this.lobsters.fetchAndParseFeed(url);
    for (const item of items.reverse()) {
      const publishedAfter = +new Date(this.publishedAfter);
      const ts = this.lobsters.itemTs(item);
      if (Number.isNaN(publishedAfter) || publishedAfter > ts) {
        continue;
      }

      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
