import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "letterdrop-new-post-published-instant",
  name: "New Post Published (Instant)",
  description: "Emit new event when a new post gets published on Letterdrop. **After creating the source, access Letterdrop UI, go to `Settings > Integrations > API and Webhooks > Webhook Endpoints > Setup endpoints` and add your source endpoint URL to the respective webhook endpoint**. [See the documentation](https://docs.letterdrop.com/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Post: ${resource.title}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
