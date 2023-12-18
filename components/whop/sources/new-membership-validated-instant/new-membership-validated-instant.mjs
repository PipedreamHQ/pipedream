import common from "../common/base.mjs";

export default {
  ...common,
  key: "whop-new-membership-validated-instant",
  name: "New Membership Validated (Instant)",
  description: "Emit new event when a membership goes valid. [See the documentation](https://dev.whop.com/api-reference/v2/webhooks/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "membership_went_valid",
      ];
    },
    getSummary({ id }) {
      return `New membership validation with ID: ${id}`;
    },
  },
};
