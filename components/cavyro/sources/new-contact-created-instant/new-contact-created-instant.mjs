import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cavyro-new-contact-created-instant",
  name: "New Contact Created (Instant)",
  description: "Emit new event when a contact is created in Cavyro. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "contact.created",
      ];
    },
    getSummary({ data }) {
      return `New contact: ${[
        data.first_name,
        data.last_name,
      ].filter(Boolean).join(" ")}`;
    },
  },
  sampleEmit,
};
