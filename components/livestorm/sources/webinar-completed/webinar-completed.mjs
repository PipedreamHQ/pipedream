import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "livestorm-webinar-completed",
  name: "Webinar Completed",
  description: "Emit new event when a Livestorm webinar is completed. [See the Documentation](https://developers.livestorm.co/reference/post_webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.SESSION_ENDED;
    },
    generateMeta(body) {
      const { data: resource } = body;
      return {
        id: resource.id,
        summary: `Webinar Completed: ${resource.id}`,
        ts: resource.attributes.ended_at,
      };
    },
  },
};
