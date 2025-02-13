import zep from "../../zep.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "zep-new-comment",
  name: "New Comment Added",
  description: "Emits a new event when a comment is added to a document in Zep. [See the documentation](https://help.getzep.com/api-reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zep,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspace: {
      propDefinition: [
        zep,
        "workspace",
      ],
    },
    document: {
      propDefinition: [
        zep,
        "document",
      ],
      optional: true,
    },
  },
  methods: {
    async getComments() {
      const {
        workspace, document,
      } = this;
      let path = `/workspaces/${workspace}/comments`;
      if (document) {
        path += `?documentId=${document}`;
      }
      return this.zep._makeRequest({
        method: "GET",
        path,
      });
    },
  },
  hooks: {
    async deploy() {
      const comments = await this.getComments();
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const recentComments = comments.slice(0, 50).reverse();

      for (const comment of recentComments) {
        const timestamp = comment.createdAt
          ? Date.parse(comment.createdAt)
          : Date.now();
        this.$emit(comment, {
          id: comment.id || timestamp,
          summary: `New Comment: ${comment.content}`,
          ts: timestamp,
        });
      }

      const lastTimestamp = recentComments.length
        ? (recentComments[recentComments.length - 1].createdAt
          ? Date.parse(recentComments[recentComments.length - 1].createdAt)
          : Date.now())
        : Date.now();
      this.db.set("lastTimestamp", lastTimestamp);
    },
    async activate() {
      // No webhook subscription needed as we are polling
    },
    async deactivate() {
      // No webhook subscription to remove
    },
  },
  async run() {
    const lastTimestamp = this.db.get("lastTimestamp") || 0;
    const currentTimestamp = Date.now();
    const comments = await this.getComments();

    const newComments = comments.filter((comment) => {
      const commentTimestamp = comment.createdAt
        ? Date.parse(comment.createdAt)
        : 0;
      return commentTimestamp > lastTimestamp;
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    for (const comment of newComments) {
      const timestamp = comment.createdAt
        ? Date.parse(comment.createdAt)
        : currentTimestamp;
      this.$emit(comment, {
        id: comment.id || timestamp,
        summary: `New Comment: ${comment.content}`,
        ts: timestamp,
      });
    }

    if (newComments.length > 0) {
      const latestTimestamp = newComments[newComments.length - 1].createdAt
        ? Date.parse(newComments[newComments.length - 1].createdAt)
        : currentTimestamp;
      this.db.set("lastTimestamp", latestTimestamp);
    } else {
      this.db.set("lastTimestamp", currentTimestamp);
    }
  },
};
