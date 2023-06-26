import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "livestorm-registrant-attended-webinar",
  name: "Registrant Attended Webinar",
  description: "Emit new event when a registrant attended a Livestorm webinar. [See the Documentation](https://developers.livestorm.co/reference/post_webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PEOPLE_ATTENDED;
    },
    generateMeta(body) {
      const { data: resource } = body;
      return {
        id: resource.id,
        summary: `Registrant Attended: ${resource.id}`,
        ts: resource.attributes.updated_at,
      };
    },
  },
};
