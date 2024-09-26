import common from "../common/activity-based.mjs";

export default {
  ...common,
  key: "jobnimbus-contact-deleted",
  name: "New Contact Deleted Event",
  description: "Emit new events when a contact is deleted. [See the docs](https://documenter.getpostman.com/view/3919598/S11PpG4x#62c713fe-5d46-4fd6-9953-db49255fd5e0)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    compareFn(item) {
      return item?.record_type_name == "Contact Deleted";
    },
    getMeta(item) {
      return {
        id: item.date_created,
        summary: `Contact has been deleted - ID: ${item.primary.id}`,
        ts: item.date_created * 1000,
      };
    },
  },
};
