import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-member-instant",
  name: "New Member (Instant)",
  description: "Emit new event when someone joins the workspace (an accepted invitation, single sign-on or SCIM). [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,

  },
  methods: {
    ...common.methods,
    getEvent() {
      return "member.added";
    },
    getSummary(item) {
      return `New member: ${item.email}`;
    },
  },
  sampleEmit,
};
