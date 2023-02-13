import productHunt from "../../product_hunt.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";

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
      propDefinition: [
        productHunt,
        "username",
      ],
      description: "The username (without the @ sign) of the user to watch for trending posts",
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
    if (this.username.startsWith("@")) {
      throw new ConfigurationError("Username should not include the @ symbol");
    }

    const { user } = await this.productHunt.listUserPosts({
      username: this.username,
    });

    if (!user) {
      throw new Error(`User with username ${this.username} does not exist`);
    }

    const posts = user.madePosts.edges?.filter((post) => post.node.votesCount > 99);
    for (const post of posts.reverse()) {
      const { node } = post;
      const meta = this.generateMeta(node);
      this.$emit(node, meta);
    }
  },
};
