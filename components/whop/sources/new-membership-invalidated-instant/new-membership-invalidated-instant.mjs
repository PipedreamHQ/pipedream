import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whop-new-membership-invalidated-instant",
  name: "New Membership Invalidated (Instant)",
  description: "Emit new event when a membership goes invalid, i.e. it expires, is cancelled, is terminated, or its payment fails past the retry window. Use this to revoke access that was granted on **New Membership Validated (Instant)** — for example removing the member from a Telegram group or Discord server. The payload's `status_reason` explains why the membership was invalidated, and `data.user` carries the member's Whop user ID, username and email. [See the documentation](https://dev.whop.com/api-reference/v2/webhooks/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "membership_went_invalid",
      ];
    },
    getSummary({ id }) {
      return `New membership invalidation with ID: ${id}`;
    },
  },
  sampleEmit,
};
