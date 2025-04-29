import common from "../common/base.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "salespype-contact-updated",
  name: "Contact Updated",
  description: "Emit new event when an existing contact is updated. [See the documentation](https://documenter.getpostman.com/view/5101444/2s93Y3u1Eb#e8b86665-e0b3-4c2e-9bd0-05fcf81f6c48)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.salespype.listContacts;
    },
    getResourceKey() {
      return "contacts";
    },
    getFieldValue(contact) {
      return Date.parse(contact.updatedAt);
    },
    generateMeta(contact) {
      return {
        id: md5(JSON.stringify({
          ...contact,
          createdAt: undefined,
          updatedAt: undefined,
        })),
        summary: `Contact Updated: ${contact.id}`,
        ts: Date.parse(contact.updatedAt),
      };
    },
  },
};
