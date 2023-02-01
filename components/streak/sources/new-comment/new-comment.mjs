import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-new-comment",
  name: "New Comment (Instant)",
  description: "Emit new event when a new comment is created within a pipeline.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const boxes = await this.streak.listBoxes({
        pipelineId: this.pipelineId,
        params: {
          limit,
          sortBy: "lastUpdatedTimestamp",
        },
      });
      const comments = [];
      for (const box of boxes) {
        const { results } = await this.streak.listComments({
          boxId: box.key,
        });
        comments.push(...results);
        if (comments.length >= limit) {
          comments.length = limit;
          break;
        }
      }
      return comments;
    },
    getEventType() {
      return "COMMENT_CREATE";
    },
    generateMeta(comment) {
      return {
        id: this.shortenKey(comment.key),
        summary: comment.message,
        ts: comment.timestamp,
      };
    },
  },
};
