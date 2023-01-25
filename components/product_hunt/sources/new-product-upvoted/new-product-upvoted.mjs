import productHunt from "../../product_hunt.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "product_hunt-new-product-upvoted",
  name: "New Product Upvoted",
  description: "Emit new event when a user upvotes a product.",
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

    const { user } = await this.productHunt.listUpvotedPosts({
      username: this.username,
    });

    if (!user) {
      throw new Error(`User with username ${this.username} does not exist`);
    }

    for (const post of user.votedPosts.edges.reverse()) {
      const { node } = post;
      const meta = this.generateMeta(node);
      this.$emit(node, meta);
    }
  },
};
