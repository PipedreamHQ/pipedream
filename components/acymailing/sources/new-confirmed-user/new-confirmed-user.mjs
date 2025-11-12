import common from "../common/base.mjs";

export default {
  ...common,
  key: "acymailing-new-confirmed-user",
  name: "New Confirmed User",
  description: "Emit new event when a user confirms their email address.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary({
      email, confirmation_date,
    }) {
      return `User ${email} confirmed at ${confirmation_date}.`;
    },
    getParams() {
      return {
        "filters[confirmed]": 1,
      };
    },
    getFn() {
      return this.acymailing.listUsers;
    },
    getDateField() {
      return "confirmation_date";
    },
  },
};
