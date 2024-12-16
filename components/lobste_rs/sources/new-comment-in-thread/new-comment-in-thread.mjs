import lobsters from "../../lobste_rs.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "lobste_rs-new-comment-in-thread",
  name: "New Comment in Thread",
  description: "Emit new event when a new comment is added to a thread.",
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
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the comment thread to retrieve. E.g. `https://lobste.rs/s/yqjtvy/cloud_container_iceberg`",
    },
  },
  methods: {
    generateMeta(comment) {
      return {
        id: comment.short_id,
        summary: comment.comment_plain.substring(0, 50),
        ts: Date.parse(comment.created_at),
      };
    },
  },
  async run() {
    const { comments } = await this.lobsters.makeRequest({
      url: `${this.url}.json`,
    });
    for (const comment of comments.reverse()) {
      const meta = this.generateMeta(comment);
      this.$emit(comment, meta);
    }
  },
};
