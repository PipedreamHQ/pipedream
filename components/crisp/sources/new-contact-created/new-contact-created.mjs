import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "crisp-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.crisp.listPeople;
    },
    getArgs(lastTs) {
      return {
        params: {
          filter_date_start: lastTs,
          sort_field: "created_at",
          sort_order: "descending",
        },
      };
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(item) {
      return {
        id: item.people_id,
        summary: `New Contact with ID: ${item.people_id}`,
        ts: item[this.getTsField()],
      };
    },
  },
};
