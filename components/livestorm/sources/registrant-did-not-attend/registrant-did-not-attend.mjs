import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "livestorm-registrant-did-not-attend",
  name: "Registrant Did Not Attend",
  description: "Emit new event when a registrant did not attend a Livestorm webinar. [See the Documentation](https://developers.livestorm.co/reference/post_webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.DEFAULT;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
