import { axios } from "@pipedream/platform";
import adhook from "../../adhook.app.mjs";

export default {
  key: "adhook-new-post",
  name: "New Post Created",
  description: "Emit new event when a new post is created. [See the documentation](https://app.adhook.io/api-doc/)",
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
    postType: {
      propDefinition: [
        adhook,
        "postType",
      ],
    },
    postAuthor: {
      propDefinition: [
        adhook,
        "postAuthor",
      ],
    },
    postTags: {
      propDefinition: [
        adhook,
        "postTags",
      ],
    },
  },
  hooks: {
    async deploy() {
      const posts = await this.adhook.emitNewPostEvent({
        params: {
          postType: this.postType,
          postAuthor: this.postAuthor,
          postTags: this.postTags,
        },
      });

      for (const post of posts.slice(0, 50)) {
        this.$emit(post, {
          id: post.id,
          summary: `New Post: ${post.title}`,
          ts: new Date(post.createdAt).getTime(),
        });
      }
    },
    async activate() {
      // Activate hook, if needed
    },
    async deactivate() {
      // Deactivate hook, if needed
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();

    const posts = await this.adhook.emitNewPostEvent({
      params: {
        postType: this.postType,
        postAuthor: this.postAuthor,
        postTags: this.postTags,
      },
    });

    for (const post of posts) {
      const postTimestamp = new Date(post.createdAt).getTime();
      if (postTimestamp > lastTimestamp) {
        this.$emit(post, {
          id: post.id,
          summary: `New Post: ${post.title}`,
          ts: postTimestamp,
        });
      }
    }

    if (posts.length > 0) {
      this._setLastTimestamp(new Date(posts[0].createdAt).getTime());
    }
  },
};
