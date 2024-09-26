import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "livestorm-new-registrant",
  name: "New Registrant",
  description: "Emit new event when a new registrant is added. [See the Documentation](https://developers.livestorm.co/reference/post_webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PEOPLE_REGISTERED;
    },
    generateMeta(body) {
      const { data: resource } = body;
      return {
        id: resource.id,
        summary: `New Registrant: ${resource.id}`,
        ts: resource?.attributes?.created_at,
      };
    },
  },
};
