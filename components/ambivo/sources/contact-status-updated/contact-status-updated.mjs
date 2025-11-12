import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ambivo-contact-status-updated",
  name: "Contact Status Updated",
  description: "Emit new event when a contact's status has been updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    contactIds: {
      propDefinition: [
        common.props.ambivo,
        "contactIds",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.ambivo.listContactStatusUpdated;
    },
    getTsField() {
      return "status_updated_date";
    },
    isRelevant(contact) {
      return !this.contactactIds || this.contactIds.includes(contact.id);
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.status_updated_date);
      return {
        id: `${contact.id}-${ts}`,
        summary: `Status Updated for Contact: ${contact.name}`,
        ts,
      };
    },
  },
  sampleEmit,
};
