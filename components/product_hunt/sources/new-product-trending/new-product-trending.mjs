import productHunt from "../../product_hunt.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "product_hunt-new-product-trending",
  name: "New Product Trending",
  description: "Emit new event when a product posted by a user hits 100+ upvotes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    productHunt,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the user to watch for trending posts",
    },
  },
  methods: {
    generateMeta(node) {
      return {
        id: node.id,
        summary: node.name,
        ts: Date.parse(node.createdAt),
      };
    },
  },
  async run() {
    const { user } = await this.productHunt.listUserPosts({
      username: this.username,
    });
    const posts = user.madePosts.edges?.filter((post) => post.node.votesCount > 99);
    for (const post of posts.reverse()) {
      const { node } = post;
      const meta = this.generateMeta(node);
      this.$emit(node, meta);
    }
  },
};
