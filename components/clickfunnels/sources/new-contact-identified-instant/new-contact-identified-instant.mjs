import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickfunnels-new-contact-identified-instant",
  name: "New Contact Identified (Instant)",
  description: "Emit new event when a fresh or formerly anonymous contact is identified via email address or contact number.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "contact.identified",
      ];
    },
    getSummary(body) {
      return `New contact identified: ${body.data.email_address || body.data.phone_number}`;
    },
  },
  sampleEmit,
};
