import base from "../common/base.mjs";

export default {
  ...base,
  key: "notion-new-comment-created",
  name: "New Comment Created",
  description: "Emit new event when a new comment is created in a page or block. [See the documentation](https://developers.notion.com/reference/retrieve-a-comment)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    pageId: {
      propDefinition: [
        base.props.notion,
        "pageId",
      ],
      description: "Unique identifier of a page or block",
    },
  },
  methods: {
    ...base.methods,
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Comment ID: ${comment.id}`,
        ts: comment.created_time,
      };
    },
  },
  async run() {
    const lastTs = this.getLastCreatedTimestamp();
    let maxTs = lastTs;
    let cursor;

    do {
      const {
        results, next_cursor: next,
      } = await this.notion._getNotionClient().comments.list({
        block_id: this.pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      if (!results?.length) {
        break;
      }
      for (const comment of results) {
        const ts = Date.parse(comment.created_time);
        if (ts >= lastTs) {
          maxTs = Math.max(ts, maxTs);
          this.$emit(comment, this.generateMeta(comment));
        }
      }
      cursor = next;
    } while (cursor);

    this.setLastCreatedTimestamp(maxTs);
  },
};
