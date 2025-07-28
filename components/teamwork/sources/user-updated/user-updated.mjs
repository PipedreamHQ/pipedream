import common from "../common/common-sources.mjs";

export default {
  ...common,
  key: "teamwork-user-updated",
  name: "User Updated (Instant)",
  description: "Emit new event when a user is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getEventName() {
      return "USER.UPDATED";
    },
    generateMeta(body) {
      const ts = Date.parse(body["User.DateCreated"]);
      return {
        id: `${body["User.ID"]}-${ts}`,
        summary: body["User.FirstName"] + " " + body["User.LastName"],
        ts,
      };
    },
  },
};
