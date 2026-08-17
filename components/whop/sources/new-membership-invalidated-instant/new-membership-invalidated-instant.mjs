import common from "../common/base.mjs";

export default {
  ...common,
  key: "whop-new-membership-invalidated-instant",
  name: "New Membership Invalidated (Instant)",
  description: "Emit new event when a membership is deactivated, i.e. it expires, is cancelled, or is terminated. Use this to revoke access that was granted by **New Membership Validated (Instant)**. [See the documentation](https://docs.whop.com/api-reference/memberships/membership-deactivated)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "membership.deactivated",
      ];
    },
    getSummary({ id }) {
      return `New membership invalidation with ID: ${id}`;
    },
  },
};
