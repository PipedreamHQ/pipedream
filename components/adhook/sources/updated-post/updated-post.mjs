import { axios } from "@pipedream/platform";
import adhook from "../../adhook.app.mjs";

export default {
  key: "adhook-updated-post",
  name: "Adhook Updated Post",
  description: "Emit new event when a post is updated. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    adhook,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    postId: {
      propDefinition: [
        adhook,
        "postId",
      ],
    },
    postAuthor: {
      propDefinition: [
        adhook,
        "postAuthor",
      ],
      optional: true,
    },
    postTags: {
      propDefinition: [
        adhook,
        "postTags",
      ],
      optional: true,
    },
    updateType: {
      propDefinition: [
        adhook,
        "updateType",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const posts = await this.adhook.emitPostUpdatedEvent({
        data: {
          postId: this.postId,
          postAuthor: this.postAuthor,
          postTags: this.postTags,
          updateType: this.updateType,
        },
      });

      for (const post of posts.slice(0, 50)) {
        this.$emit(post, {
          id: post.id,
          summary: `Post Updated: ${post.title}`,
          ts: Date.parse(post.updated_at),
        });
      }
    },
    async activate() {
      // Any activation logic if needed
    },
    async deactivate() {
      // Any deactivation logic if needed
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const posts = await this.adhook.emitPostUpdatedEvent({
      data: {
        postId: this.postId,
        postAuthor: this.postAuthor,
        postTags: this.postTags,
        updateType: this.updateType,
      },
    });

    for (const post of posts) {
      const postTimestamp = Date.parse(post.updated_at);
      if (postTimestamp > lastTimestamp) {
        this.$emit(post, {
          id: post.id,
          summary: `Post Updated: ${post.title}`,
          ts: postTimestamp,
        });
        this._setLastTimestamp(postTimestamp);
      }
    }
  },
};
