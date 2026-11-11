import common from "../common/base.mjs";

export default {
  ...common,
  key: "whop-new-membership-validated-instant",
  name: "New Membership Validated (Instant)",
  description: "Emit new event when a membership is activated. [See the documentation](https://docs.whop.com/api-reference/memberships/membership-activated)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "membership.activated",
      ];
    },
    getSummary({ id }) {
      return `New membership validation with ID: ${id}`;
    },
  },
};
