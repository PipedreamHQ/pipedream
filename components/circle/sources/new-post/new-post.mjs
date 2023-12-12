import circle from "../../circle.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "circle-new-post",
  name: "New Post Published",
  description: "Emits an event each time a new post gets published in the community. [See the documentation](https://api.circle.so)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    circle,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    community_id: {
      propDefinition: [
        circle,
        "community_id",
      ],
    },
    space_id: {
      propDefinition: [
        circle,
        "space_id",
        (c) => ({
          community_id: c.community_id,
        }),
      ],
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") || null;
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      // Fetching the most recent posts to determine the current state
      const posts = await this.circle.listPosts(this.community_id, this.space_id);
      if (posts.length > 0) {
        // Assuming posts are sorted in descending order (newest first)
        this._setAfter(posts[0].created_at);
      }
    },
  },
  async run() {
    let after = this._getAfter();
    let hasMore = true;
    let maxCreatedAt = after;

    while (hasMore) {
      const params = after
        ? {
          after,
        }
        : {};
      const posts = await this.circle.listPosts(this.community_id, this.space_id, params);

      if (posts.length === 0) {
        hasMore = false;
      } else {
        for (const post of posts) {
          this.$emit(post, {
            id: post.id,
            summary: `New Post: ${post.title}`,
            ts: Date.parse(post.created_at),
          });

          if (!maxCreatedAt || new Date(post.created_at) > new Date(maxCreatedAt)) {
            maxCreatedAt = post.created_at;
          }
        }

        const lastPost = posts[posts.length - 1];
        if (new Date(lastPost.created_at) <= new Date(after)) {
          hasMore = false;
        }
      }
    }

    if (maxCreatedAt) {
      this._setAfter(maxCreatedAt);
    }
  },
};
