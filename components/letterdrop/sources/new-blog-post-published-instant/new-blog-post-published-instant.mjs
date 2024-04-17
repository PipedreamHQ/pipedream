import { axios } from "@pipedream/platform";
import letterdrop from "../../letterdrop.app.mjs";

export default {
  key: "letterdrop-new-blog-post-published-instant",
  name: "New Blog Post Published (Instant)",
  description: "Emits an event when a new blog post gets published on Letterdrop. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    letterdrop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // polling interval set to 60 seconds
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent posts and emit them
      const { posts: recentPosts } = await this.letterdrop._makeRequest({
        method: "POST",
        path: "/posts",
        data: {
          offset: 0,
          limit: 50,
        },
      });

      recentPosts.slice(0, 50).reverse()
        .forEach((post) => {
          this.$emit(post, {
            id: post.id,
            summary: post.title,
            ts: Date.parse(post.publishedOn),
          });
        });

      // Store the ID of the most recent post
      this.db.set("lastPostId", recentPosts[0].id);
    },
  },
  async run() {
    const lastPostId = this.db.get("lastPostId") || 0;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.letterdrop._makeRequest({
        method: "POST",
        path: "/posts",
        data: {
          offset,
          limit: 5,
        },
      });

      const {
        posts, meta,
      } = response;
      hasMore = meta.hasNextPage;

      posts.forEach((post) => {
        if (post.id === lastPostId) {
          hasMore = false;
          return;
        }

        if (post.status === "published") {
          this.$emit(post, {
            id: post.id,
            summary: post.title,
            ts: Date.parse(post.publishedOn),
          });
        }
      });

      if (posts.length) {
        this.db.set("lastPostId", posts[0].id);
      }

      offset += 5;
    }
  },
};
