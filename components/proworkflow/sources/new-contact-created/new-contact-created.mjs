import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "proworkflow-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return constants.EVENT_NAME.NEWCONTACT;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Contact: ${event.contact.id}`,
        ts: Date.parse(event.contact.lastmodified),
      };
    },
  },
};
