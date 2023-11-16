import common from "../common/base.mjs";

export default {
  ...common,
  key: "slottable-booking-contact-updated",
  name: "Booking Contact Updated",
  version: "0.0.1",
  description: "Emit new event when a booking contact is changed (new, updated, or deleted) in Slottable.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "BookingContact";
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.updated_at);
      return {
        id: `${contact.id}-${ts}`,
        summary: `Booking Contact Updated with ID ${contact.id}`,
        ts,
      };
    },
  },
};
