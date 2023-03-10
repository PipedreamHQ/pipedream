import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "ontraport-new-contact-created",
  name: "New Contact Created (Instant)",
  description: "Emit new event when a new contact is created. [See the docs](https://api.ontraport.com/doc/#object-is-created).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return `${events.OBJECT_CREATE}(${constants.OBJECT_TYPE_ID.CONTACT})`;
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Contact ${data.id}`,
        ts: body.timestamp,
      };
    },
  },
};
