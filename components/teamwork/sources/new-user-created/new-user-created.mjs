import common from "../common/common-sources.mjs";

export default {
  ...common,
  key: "teamwork-new-user-created",
  name: "New User Created (Instant)",
  description: "Emit new event when a new user is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getEventName() {
      return "USER.CREATED";
    },
    generateMeta(body) {
      return {
        id: body["User.ID"],
        summary: body["User.FirstName"] + " " + body["User.LastName"],
        ts: Date.parse(body["User.DateCreated"]),
      };
    },
  },
};
