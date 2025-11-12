import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "cisco_webex-new-message",
  name: "New Message (Instant)",
  description: "Emit new event when a message is added. [See the docs here](https://developer.webex.com/docs/api/guides/webhooks#webex-webhooks)",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "New Message";
    },
    getResourceType() {
      return constants.RESOURCE_TYPE.MESSAGES;
    },
    getEventType() {
      return constants.EVENT_TYPE.CREATED;
    },
    getMetadata(body) {
      const {
        data: resource,
        created,
      } = body;
      return {
        id: resource.id,
        summary: `New message created by ${resource.personEmail}`,
        ts: Date.parse(created),
      };
    },
  },
};
