import productHunt from "../../product_hunt.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "product_hunt-new-product-added",
  name: "New Product Added",
  description: "Emit new event when any new product is posted.",
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
    topic: {
      propDefinition: [
        productHunt,
        "topic",
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
    const { posts } = await this.productHunt.listPosts({
      topic: this.topic,
    });
    for (const post of posts.edges.reverse()) {
      const { node } = post;
      const meta = this.generateMeta(node);
      this.$emit(node, meta);
    }
  },
};
