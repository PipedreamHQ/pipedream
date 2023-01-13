import productHunt from "../../product_hunt.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
      type: "string",
      label: "Username",
      description: "The username of the user to watch for upvotes",
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
    const { user } = await this.productHunt.listUpvotedPosts({
      username: this.username,
    });
    for (const post of user.votedPosts.edges.reverse()) {
      const { node } = post;
      const meta = this.generateMeta(node);
      this.$emit(node, meta);
    }
  },
};
