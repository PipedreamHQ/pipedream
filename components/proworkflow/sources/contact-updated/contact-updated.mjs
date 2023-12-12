import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "proworkflow-contact-updated",
  name: "Contact Updated",
  description: "Emit new event when a contact is updated. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return constants.EVENT_NAME.EDITCONTACT;
    },
    generateMeta(event) {
      const ts = Date.parse(event.contact.lastmodified);
      return {
        id: `${event.id}-${ts}`,
        summary: `Contact Updated: ${event.contact.id}`,
        ts,
      };
    },
  },
};
